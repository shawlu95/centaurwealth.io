import express, { Request, Response } from 'express';
import { param, query } from 'express-validator';
import { Account } from '../../model/account';
import { StatusCodes } from 'http-status-codes';
import {
  AccountType,
  BadRequestError,
  Entry,
  EntryType,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@bookkeeping/common';
import { Transaction } from '../../model/transaction';

const router = express.Router();

const validators = [
  param('id').not().isEmpty().withMessage('Please provide account id'),
  param('id').isMongoId().withMessage('Please provide valid account id'),
  query('lte').not().isEmpty().withMessage('Please provide end of close date'),
];

router.get(
  '/api/account/close/:id',
  requireAuth,
  validators,
  validateRequest,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const accountId = req.params.id;
    const lte = req.query.lte!;
    const account = await Account.findById(accountId);

    if (!account) {
      throw new NotFoundError();
    }

    if (account.userId !== userId) {
      throw new NotAuthorizedError();
    }

    if (account.type !== AccountType.Temporary) {
      throw new BadRequestError('Not a temporary account');
    }

    const gt = account.close;
    const closable = await Transaction.find({
      userId,
      date: {
        $gt: gt,
        $lte: lte,
      },
      entries: { $elemMatch: { accountId } },
    });

    if (closable.length === 0) {
      throw new BadRequestError('No transaction in period');
    }

    const entries = closable
      .flatMap((x) => x.entries)
      .filter((x) => x.accountId == accountId);

    const debit = entries
      .filter((x) => x.type === EntryType.Debit)
      .reduce((x, y) => x + y.amount, 0);

    const credit = entries
      .filter((x) => x.type === EntryType.Credit)
      .reduce((x, y) => x + y.amount, 0);

    const transaction = {
      memo: 'Closing ' + account.name,
      date: lte,
      entries: [] as Entry[],
    };

    if (debit > 0) {
      transaction.entries.push({
        amount: debit,
        type: EntryType.Credit,
        accountId: account.id,
        accountName: account.name,
        accountType: account.type,
      });
    }

    if (credit > 0) {
      transaction.entries.push({
        amount: credit,
        type: EntryType.Debit,
        accountId: account.id,
        accountName: account.name,
        accountType: account.type,
      });
    }

    return res.status(StatusCodes.OK).send({ transaction, closable });
  }
);

export { router as accountClose };
