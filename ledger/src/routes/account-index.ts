import express, { Request, Response } from 'express';
import { param, query } from 'express-validator';
import { Account } from '../model/account';
import { StatusCodes } from 'http-status-codes';
import {
  EntryType,
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

    const account = await Account.findById(accountId);

    if (!account) {
      throw new NotFoundError();
    }

    if (account.userId !== userId) {
      throw new NotAuthorizedError();
    }

    const transactions = await Transaction.paginate({
      query: {
        entries: { $elemMatch: { accountId } },
      },
      sort: { date: -1 },
      page: parseInt(req.query.page as string, 10),
      limit: parseInt(req.query.limit as string, 10),
    });

    if (!transactions) {
      throw new NotFoundError();
    }

    for (var i in transactions?.docs) {
      const transaction = transactions.docs[i];
      transaction.id = transactions.docs[i]._id;
      delete transaction._id;
      transaction.debit = transaction.entries
        .filter((e) => e.accountId == accountId && e.type === EntryType.Debit)
        .reduce((x, y) => x + y.amount, 0);
      transaction.credit = transaction.entries
        .filter((e) => e.accountId == accountId && e.type === EntryType.Credit)
        .reduce((x, y) => x + y.amount, 0);
    }

    return res.status(StatusCodes.OK).send({ account, transactions });
  }
);

export { router as accountRead };
