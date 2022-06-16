import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Account, AccountType } from '../models/account';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  requireAuth,
  validateRequest,
} from '@bookkeeping/common';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const validators = [
  body('name').not().isEmpty().withMessage('Please provide account name'),
  body('type').not().isEmpty().withMessage('Please provide account type'),
  body('type').custom((type: string) =>
    Object.values(AccountType).includes(type as AccountType)
  ),
];

router.get(
  '/api/balance/current',
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const accounts = await Account.find({ userId }).sort({ type: 1, name: 1 });
    return res.status(StatusCodes.OK).send({ accounts });
  }
);

export { router as balanceCurrent };
