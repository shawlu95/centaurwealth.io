import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { TransactionCreatedListener } from '../transaction-created-listener';
import {
  TransactionCreatedEvent,
  AccountType,
  EntryType,
} from '@bookkeeping/common';
import mongoose from 'mongoose';
import { Point } from '../../../model/point';

it('adjusts asset and liability for user', async () => {
  // create a listener isntance
  const rand = () => new mongoose.Types.ObjectId().toHexString();
  const listener = new TransactionCreatedListener(natsWrapper.client);
  const userId = rand();

  // create a fake data event
  const data: TransactionCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    memo: 'loan',
    date: new Date(),
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

  // create a fake message with fake ack function
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  expect(msg.ack).not.toHaveBeenCalled();

  await listener.onMessage(data, msg);

  const points = await Point.find({ userId });
  expect(points.length).toEqual(1);
  expect(points[0].asset).toEqual(10);
  expect(points[0].liability).toEqual(10);

  expect(msg.ack).toHaveBeenCalled();
});
