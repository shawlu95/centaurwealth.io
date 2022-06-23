import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import {
  EntryType,
  TransactionDeletedEvent,
  TransactionCreatedEvent,
  TransactionUpdatedEvent,
  AccountType,
} from '@bookkeeping/common';
import { TransactionCreatedListener } from '../transaction-created-listener';
import { TransactionUpdatedListener } from '../transaction-updated-listener';
import { TransactionDeletedListener } from '../transaction-deleted-listener';
import { Budget } from '../../../models/budget';

export const randId = () => new mongoose.Types.ObjectId().toHexString();

export const buildDefaultBudget = async (userId: string) => {
  const budget = Budget.build({
    userId,
    name: 'Default',
    monthly: 10000,
  });
  await budget.save();
  return budget;
};

export const buildTransactionCreatedEvent = async () => {
  const userId = randId();
  await buildDefaultBudget(userId);
  const listener = new TransactionCreatedListener(natsWrapper.client);
  const data: TransactionCreatedEvent['data'] = {
    id: randId(),
    userId,
    memo: 'fun',
    date: new Date(),
    entries: [
      {
        amount: 10,
        type: EntryType.Credit,
        accountId: randId(),
        accountName: 'Cash',
        accountType: AccountType.Asset,
      },
      {
        amount: 10,
        type: EntryType.Debit,
        accountId: randId(),
        accountName: 'Expense',
        accountType: AccountType.Temporary,
      },
    ],
  };

  // create a fake message with fake ack function
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

export const buildTransactionUpdatedEvent = async () => {
  const userId = randId();
  await buildDefaultBudget(userId);
  const listener = new TransactionUpdatedListener(natsWrapper.client);
  const data: TransactionUpdatedEvent['data'] = {
    id: randId(),
    userId,
    memo: 'fun',
    date: new Date(),
    entries: {
      old: [
        {
          amount: 10,
          type: EntryType.Credit,
          accountId: randId(),
          accountName: 'Cash',
          accountType: AccountType.Asset,
        },
        {
          amount: 10,
          type: EntryType.Debit,
          accountId: randId(),
          accountName: 'Expense',
          accountType: AccountType.Temporary,
        },
      ],
      new: [
        {
          amount: 15,
          type: EntryType.Credit,
          accountId: randId(),
          accountName: 'Cash',
          accountType: AccountType.Asset,
        },
        {
          amount: 15,
          type: EntryType.Debit,
          accountId: randId(),
          accountName: 'Expense',
          accountType: AccountType.Temporary,
        },
      ],
    },
  };

  // create a fake message with fake ack function
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

export const buildTransactionDeletedEvent = async () => {
  const userId = randId();
  await buildDefaultBudget(userId);
  const listener = new TransactionDeletedListener(natsWrapper.client);
  const data: TransactionDeletedEvent['data'] = {
    id: randId(),
    userId,
    memo: 'fun',
    date: new Date(),
    entries: [
      {
        amount: 10,
        type: EntryType.Credit,
        accountId: randId(),
        accountName: 'Cash',
        accountType: AccountType.Asset,
      },
      {
        amount: 10,
        type: EntryType.Debit,
        accountId: randId(),
        accountName: 'Expense',
        accountType: AccountType.Temporary,
      },
    ],
  };

  // create a fake message with fake ack function
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};
