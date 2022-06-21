import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import {
  Subjects,
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
    date: new Date('2022-01-01'),
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

it('closes account when expense balance reaches zero', async () => {
  const { cash: retainedEarning, expense, listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const close: TransactionCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: expense.userId,
    memo: 'close',
    date: new Date('2022-01-02'),
    entries: [
      {
        amount: 10,
        type: EntryType.Credit,
        accountId: expense.id,
        accountName: expense.name,
        accountType: expense.type,
      },
      {
        amount: 10,
        type: EntryType.Debit,
        accountId: retainedEarning.id,
        accountName: retainedEarning.name,
        accountType: retainedEarning.type,
      },
    ],
  };

  await listener.onMessage(close, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const [subject, str] = (natsWrapper.client.publish as jest.Mock).mock
    .calls[0];
  const accountClosedEvent = JSON.parse(str);

  expect(subject).toEqual(Subjects.AccountClosed);
  expect(accountClosedEvent.id).toEqual(expense.id);
  expect(new Date(accountClosedEvent.date)).toEqual(new Date(close.date));
  expect(accountClosedEvent.userId).toEqual(expense.userId);
  expect(accountClosedEvent.type).toEqual(expense.type);
  expect(accountClosedEvent.name).toEqual(expense.name);
});

it('acks the message', async () => {
  const { cash, expense, listener, data, msg } = await setup();

  expect(msg.ack).not.toHaveBeenCalled();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
