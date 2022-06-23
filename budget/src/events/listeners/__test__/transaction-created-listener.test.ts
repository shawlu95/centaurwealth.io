import { AccountType } from '@bookkeeping/common';
import { Expense } from '../../../models/expense';
import { buildTransactionCreatedEvent } from './utils';

it('creates expense object', async () => {
  const { listener, data, msg } = await buildTransactionCreatedEvent();

  await listener.onMessage(data, msg);

  const expense = await Expense.findById(data.id);
  expect(expense).toBeDefined();
  expect(expense!.userId).toEqual(data.userId);
  expect(expense!.id).toEqual(data.id);
  expect(expense!.amount).toEqual(10);
});

it('does not create expense object if transaction involves no expensde', async () => {
  const { listener, data, msg } = await buildTransactionCreatedEvent();

  // change second entry from expense to something else
  data.entries[1].accountType = AccountType.Asset;
  data.entries[1].accountName = 'foo';

  await listener.onMessage(data, msg);

  const expense = await Expense.findById(data.id);
  expect(expense).toBeNull();
});

it('acks the message', async () => {
  const { listener, data, msg } = await buildTransactionCreatedEvent();

  expect(msg.ack).not.toHaveBeenCalled();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
