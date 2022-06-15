import { Message } from 'node-nats-streaming';
import { AccountType, EntryType } from '@bookkeeping/common';
import mongoose from 'mongoose';

export const rand = () => new mongoose.Types.ObjectId().toHexString();

// create a fake message with fake ack function
// @ts-ignore
export const msg: Message = {
  ack: jest.fn(),
};

export const getTransactionCreatedEvent = (userId: string, date: Date) => {
  return {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    memo: 'loan',
    date: date,
    entries: [
      {
        amount: 10,
        type: EntryType.Debit,
        accountId: rand(),
        accountName: 'cash',
        accountType: AccountType.Asset,
      },
      {
        amount: 10,
        type: EntryType.Credit,
        accountId: rand(),
        accountName: 'debt',
        accountType: AccountType.Liability,
      },
    ],
  };
};

export const getTransactionDeletedEvent = (userId: string, date: Date) => {
  return getTransactionCreatedEvent(userId, date);
};

export const getTransactionUpdatedEvent = (userId: string, date: Date) => {
  return {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    memo: 'loan',
    date,
    entries: {
      old: [
        {
          amount: 10,
          type: EntryType.Debit,
          accountId: rand(),
          accountName: 'cash',
          accountType: AccountType.Asset,
        },
        {
          amount: 10,
          type: EntryType.Credit,
          accountId: rand(),
          accountName: 'debt',
          accountType: AccountType.Liability,
        },
      ],
      new: [
        {
          amount: 2,
          type: EntryType.Debit,
          accountId: rand(),
          accountName: 'cash',
          accountType: AccountType.Asset,
        },
        {
          amount: 2,
          type: EntryType.Credit,
          accountId: rand(),
          accountName: 'debt',
          accountType: AccountType.Liability,
        },
      ],
    },
  };
};
