import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import {
  AccountUpdatedEvent,
  AccountType,
  TransactionCreatedEvent,
  EntryType,
} from '@bookkeeping/common';
import mongoose from 'mongoose';
import { Account } from '../../../models/account';
import { buildAccountPair } from './transaction-test-util';
import { TransactionCreatedListener } from '../transaction-created-listener';

const setup = async () => {
  const listener = new TransactionCreatedListener(natsWrapper.client);
  const { userId, cash, expense } = await buildAccountPair();

  const data: TransactionCreatedEvent['data'] = {
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

it('adds debit and credit amount to accounts', async () => {
  const { cash, expense, listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedCash = await Account.findById(cash.id);
  const updatedExpense = await Account.findById(expense.id);

  expect(updatedCash?.credit).toEqual(10);
  expect(updatedCash?.debit).toEqual(0);

  expect(updatedExpense?.credit).toEqual(0);
  expect(updatedExpense?.debit).toEqual(10);
});

it('acks the message', async () => {
  const { cash, expense, listener, data, msg } = await setup();

  expect(msg.ack).not.toHaveBeenCalled();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
