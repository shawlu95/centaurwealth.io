import { Account } from '../../../models/account';
import { buildTransactionEvent } from './transaction-test-util';

it('undoes existing transaction', async () => {
  const { cash, expense, listener, data, msg } = await buildTransactionEvent();

  expect(cash.credit).toEqual(0);
  expect(cash.debit).toEqual(0);

  expect(expense.credit).toEqual(0);
  expect(expense.debit).toEqual(0);

  await listener.onMessage(data, msg);

  const updatedCash = await Account.findById(cash.id);
  const updatedExpense = await Account.findById(expense.id);

  expect(updatedCash?.credit).toEqual(-10);
  expect(updatedCash?.debit).toEqual(0);

  expect(updatedExpense?.credit).toEqual(0);
  expect(updatedExpense?.debit).toEqual(-10);
});

it('acks the message', async () => {
  const { listener, data, msg } = await buildTransactionEvent();

  expect(msg.ack).not.toHaveBeenCalled();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
