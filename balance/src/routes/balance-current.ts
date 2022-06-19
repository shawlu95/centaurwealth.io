import express, { Request, Response } from 'express';
import { Account } from '../models/account';
import { StatusCodes } from 'http-status-codes';
import { requireAuth } from '@bookkeeping/common';

const router = express.Router();

router.get(
  '/api/balance/current',
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const accounts = await Account.find({ userId }).sort({ type: 1, name: 1 });
    const summary = await Account.summary(userId);
    return res.status(StatusCodes.OK).send({ accounts, summary });
  }
);

export { router as balanceCurrent };
