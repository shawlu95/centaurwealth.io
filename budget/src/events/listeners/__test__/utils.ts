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

export const randId = () => new mongoose.Types.ObjectId().toHexString();

export const buildTransactionCreatedEvent = async () => {
  const listener = new TransactionCreatedListener(natsWrapper.client);
  const data: TransactionCreatedEvent['data'] = {
    id: randId(),
    userId: randId(),
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
  const listener = new TransactionUpdatedListener(natsWrapper.client);
  const data: TransactionUpdatedEvent['data'] = {
    id: randId(),
    userId: randId(),
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
  const listener = new TransactionDeletedListener(natsWrapper.client);
  const data: TransactionDeletedEvent['data'] = {
    id: randId(),
    userId: randId(),
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
