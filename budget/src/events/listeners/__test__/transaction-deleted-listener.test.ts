import { natsWrapper } from '../../../nats-wrapper';
import { Expense } from '../../../models/expense';
import { buildTransactionCreatedEvent } from './utils';
import { TransactionDeletedListener } from '../transaction-deleted-listener';

it('deletes expense object', async () => {
  const deleteListener = new TransactionDeletedListener(natsWrapper.client);
  const { listener, data, msg } = await buildTransactionCreatedEvent();

  await listener.onMessage(data, msg);
  const expense = await Expense.findById(data.id);
  expect(expense!.amount).toEqual(10);

  await deleteListener.onMessage(data, msg);

  const deleted = await Expense.findById(data.id);
  expect(deleted).toBeNull();
});
