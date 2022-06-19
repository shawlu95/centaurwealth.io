import mongoose from 'mongoose';
import { Account, AccountType } from '../../../models/account';
import { TransactionDeletedListener } from '../transaction-deleted-listener';

import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { EntryType, TransactionDeletedEvent } from '@bookkeeping/common';

export const buildAccountPair = async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cash = Account.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    name: 'cash',
    type: AccountType.Asset,
  });
  await cash.save();

  const expense = Account.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    name: 'expense',
    type: AccountType.Temporary,
  });
  await expense.save();

  return { userId, cash, expense };
};

export const buildTransactionEvent = async () => {
  const listener = new TransactionDeletedListener(natsWrapper.client);
  const { userId, cash, expense } = await buildAccountPair();

  const data: TransactionDeletedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    memo: 'fun',
    date: new Date(),
    entries: [
      {
        amount: 10,
        type: EntryType.Credit,
        accountId: cash.id,
        accountName: cash.name,
        accountType: cash.type,
      },
      {
        amount: 10,
        type: EntryType.Debit,
        accountId: expense.id,
        accountName: expense.name,
        accountType: expense.type,
      },
    ],
  };

  // create a fake message with fake ack function
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { cash, expense, listener, data, msg };
};
