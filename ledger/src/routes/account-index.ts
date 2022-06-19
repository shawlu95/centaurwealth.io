import express, { Request, Response } from 'express';
import { param, query } from 'express-validator';
import { Account } from '../model/account';
import { StatusCodes } from 'http-status-codes';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@bookkeeping/common';
import { Transaction } from '../model/transaction';

const router = express.Router();

router.get('/api/account', requireAuth, async (req: Request, res: Response) => {
  const userId = req.currentUser!.id;
  const accounts = await Account.find({ userId });
  return res.status(StatusCodes.OK).send({ accounts });
});

const validators = [
  param('id').not().isEmpty().withMessage('Please provide account id'),
  query('limit').not().isEmpty().withMessage('Please provide page size'),
  query('page').not().isEmpty().withMessage('Please provide page'),
];

router.get(
  '/api/account/:id',
  requireAuth,
  validators,
  validateRequest,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const accountId = req.params.id;

    const limit = parseInt(req.query.limit as string, 10);
    const page = parseInt(req.query.page as string, 10);

    const account = await Account.findById(accountId);

    if (!account) {
      throw new NotFoundError();
    }

    if (account.userId !== userId) {
      throw new NotAuthorizedError();
    }

    const query = {
      entries: { $elemMatch: { accountId } },
    };

    const transactions = await Transaction.find(query)
      .sort({ date: 'descending' })
      .skip(page * limit)
      .limit(limit);
    return res.status(StatusCodes.OK).send({ account, transactions });
  }
);

export { router as accountRead };
