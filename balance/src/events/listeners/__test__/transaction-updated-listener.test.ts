import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import {
  AccountUpdatedEvent,
  AccountType,
  TransactionCreatedEvent,
  EntryType,
  TransactionUpdatedEvent,
} from '@bookkeeping/common';
import mongoose from 'mongoose';
import { Account } from '../../../models/account';
import { buildAccountPair } from './transaction-test-util';
import { TransactionUpdatedListener } from '../transaction-updated-listener';

const setup = async () => {
  const listener = new TransactionUpdatedListener(natsWrapper.client);
  const { userId, cash, expense } = await buildAccountPair();

  const data: TransactionUpdatedEvent['data'] = {
    id: userId, // deprecated
    userId,
    memo: 'fun',
    date: new Date(),
    entries: {
      old: [
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
      new: [
        {
          amount: 15,
          type: EntryType.Credit,
          accountId: cash.id,
          accountName: cash.name,
          accountType: cash.type,
        },
        {
          amount: 15,
          type: EntryType.Debit,
          accountId: expense.id,
          accountName: expense.name,
          accountType: expense.type,
        },
      ],
    },
  };

  // create a fake message with fake ack function
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { cash, expense, listener, data, msg };
};

it('undoes existing transaction', async () => {
  const { cash, expense, listener, data, msg } = await setup();

  expect(cash.credit).toEqual(0);
  expect(cash.debit).toEqual(0);

  expect(expense.credit).toEqual(0);
  expect(expense.debit).toEqual(0);

  await listener.onMessage(data, msg);

  const updatedCash = await Account.findById(cash.id);
  const updatedExpense = await Account.findById(expense.id);

  expect(updatedCash?.credit).toEqual(5);
  expect(updatedCash?.debit).toEqual(0);

  expect(updatedExpense?.credit).toEqual(0);
  expect(updatedExpense?.debit).toEqual(5);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  expect(msg.ack).not.toHaveBeenCalled();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
