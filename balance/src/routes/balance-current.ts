import express, { Request, Response } from 'express';
import { Account } from '../models/account';
import { StatusCodes } from 'http-status-codes';
const router = express.Router();

router.get('/api/balance/current', async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const accounts = await Account.find({ userId }).sort({
    type: 1,
    balance: -1,
  });
  const summary = await Account.summary(userId);
  return res.status(StatusCodes.OK).send({ accounts, summary });
});

export { router as balanceCurrent };
