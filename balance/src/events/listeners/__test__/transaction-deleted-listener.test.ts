import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import {
  AccountUpdatedEvent,
  AccountType,
  TransactionCreatedEvent,
  EntryType,
  TransactionDeletedEvent,
} from '@bookkeeping/common';
import mongoose from 'mongoose';
import { Account } from '../../../models/account';
import { Transaction } from '../../../models/transaction';
import { buildTransaction } from './transaction-test-util';
import { TransactionDeletedListener } from '../transaction-deleted-listener';

const setup = async () => {
  const listener = new TransactionDeletedListener(natsWrapper.client);
  const { userId, cash, expense, transaction } = await buildTransaction();

  const data: TransactionDeletedEvent['data'] = {
    id: transaction.id,
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

  expect(cash.credit).toEqual(10);
  expect(cash.debit).toEqual(0);

  expect(expense.credit).toEqual(0);
  expect(expense.debit).toEqual(10);

  await listener.onMessage(data, msg);

  const updatedCash = await Account.findById(cash.id);
  const updatedExpense = await Account.findById(expense.id);

  expect(updatedCash?.credit).toEqual(0);
  expect(updatedCash?.debit).toEqual(0);

  expect(updatedExpense?.credit).toEqual(0);
  expect(updatedExpense?.debit).toEqual(0);

  const transaction = await Transaction.findById(data.id);
  expect(transaction).toBeNull();
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  expect(msg.ack).not.toHaveBeenCalled();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
