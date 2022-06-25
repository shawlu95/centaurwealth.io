import { param, body } from 'express-validator';
import express, { Request, Response } from 'express';
import { Account } from '../../model/account';
import { Transaction } from '../../model/transaction';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@bookkeeping/common';
import { AccountUpdatedPublisher } from '../../events/publishers/account-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

const validators = [
  param('id').not().isEmpty().withMessage('Please provide account id'),
  param('id').isMongoId().withMessage('Please provide valid account id'),
  body('name').not().isEmpty().withMessage('Please provide account name'),
];

router.patch(
  '/api/account/:id',
  requireAuth,
  validators,
  validateRequest,
  async (req: Request, res: Response) => {
    const { name } = req.body;
    const { id } = req.params;
    const userId = req.currentUser!.id;

    const account = await Account.findById(id);
    if (!account) {
      throw new NotFoundError();
    }

    if (!account.mutable) {
      throw new BadRequestError('Account is immutable');
    }

    const exist = await Account.findOne({ userId, name });
    if (exist && exist.id !== id) {
      throw new BadRequestError('Collide with existing account');
    }

    if (account.userId != req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    account.set({ name });
    await account.save();

    // update denormalized account names on all transaction entries
    const transactions = await Transaction.find({
      entries: { $elemMatch: { accountId: id } },
    });
    for (var i in transactions) {
      const transaction = transactions[i];
      const entries = transaction.entries.filter(
        (entry) => entry.accountId === id
      );
      for (var j in entries) {
        entries[j].accountName = name;
      }
      await transaction.save();
    }

    new AccountUpdatedPublisher(natsWrapper.client).publish({
      id: account.id,
      userId: account.userId,
      name: account.name,
      type: account.type,
    });

    return res.status(StatusCodes.OK).send({ id: account.id });
  }
);

export { router as accountUpdate };
