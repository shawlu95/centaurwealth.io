import {
  AccountType,
  EntryType,
  TransactionUpdatedEvent,
} from '@bookkeeping/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Expense } from '../../../models/expense';
import {
  buildTransactionCreatedEvent,
  buildTransactionUpdatedEvent,
  randId,
} from './utils';
import { TransactionUpdatedListener } from '../transaction-updated-listener';

it('updates expense object', async () => {
  const updateListener = new TransactionUpdatedListener(natsWrapper.client);
  const { listener, data, msg } = await buildTransactionCreatedEvent();

  await listener.onMessage(data, msg);
  const expense = await Expense.findById(data.id);
  expect(expense!.amount).toEqual(10);

  const event: TransactionUpdatedEvent['data'] = {
    ...data,
    entries: {
      old: data.entries,
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

  await updateListener.onMessage(event, msg);

  const updated = await Expense.findById(event.id);
  expect(updated!.userId).toEqual(event.userId);
  expect(updated!.amount).toEqual(15);
});

it('undoes old expense if new transaction has no expense', async () => {
  const updateListener = new TransactionUpdatedListener(natsWrapper.client);
  const { listener, data, msg } = await buildTransactionCreatedEvent();

  await listener.onMessage(data, msg);
  const expense = await Expense.findById(data.id);
  expect(expense!.amount).toEqual(10);

  const event: TransactionUpdatedEvent['data'] = {
    ...data,
    entries: {
      old: data.entries,
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
          accountName: 'Property',
          accountType: AccountType.Asset,
        },
      ],
    },
  };

  await updateListener.onMessage(event, msg);

  const updated = await Expense.findById(event.id);
  expect(updated).toBeNull();
});

it('creates expense if new transaction has expense and old version doesn not', async () => {
  const updateListener = new TransactionUpdatedListener(natsWrapper.client);
  const { listener, data, msg } = await buildTransactionCreatedEvent();

  await listener.onMessage(
    {
      ...data,
      entries: [
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
          accountName: 'Property',
          accountType: AccountType.Asset,
        },
      ],
    },
    msg
  );
  const expense = await Expense.findById(data.id);
  expect(expense).toBeNull();

  await updateListener.onMessage(
    {
      ...data,
      entries: {
        old: data.entries,
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
    },
    msg
  );

  const updated = await Expense.findById(data.id);
  expect(updated!.userId).toEqual(data.userId);
  expect(updated!.amount).toEqual(15);
});

it('acks the message', async () => {
  const { listener, data } = await buildTransactionUpdatedEvent();

  // create a fake message with fake ack function
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  expect(msg.ack).not.toHaveBeenCalled();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
