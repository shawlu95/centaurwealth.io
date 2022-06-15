import { natsWrapper } from '../../../nats-wrapper';
import { TransactionUpdatedListener } from '../transaction-updated-listener';
import { TransactionUpdatedEvent } from '@bookkeeping/common';
import { Point } from '../../../model/point';
import { msg, rand, getTransactionUpdatedEvent } from './transaction-test-util';

it('adjusts asset and liability for user', async () => {
  // create a listener isntance
  const listener = new TransactionUpdatedListener(natsWrapper.client);
  const userId = rand();

  // create a fake data event
  const data: TransactionUpdatedEvent['data'] = getTransactionUpdatedEvent(
    userId,
    new Date()
  );

  expect(msg.ack).not.toHaveBeenCalled();

  await listener.onMessage(data, msg);

  const points = await Point.find({ userId });
  expect(points.length).toEqual(1);
  expect(points[0].asset).toEqual(-8);
  expect(points[0].liability).toEqual(-8);

  expect(msg.ack).toHaveBeenCalled();
});

it('backfills future data point', async () => {
  const listener = new TransactionUpdatedListener(natsWrapper.client);
  const userId = rand();

  // create a fake data event
  const older: TransactionUpdatedEvent['data'] = getTransactionUpdatedEvent(
    userId,
    new Date('2021-01-01')
  );

  const newer: TransactionUpdatedEvent['data'] = getTransactionUpdatedEvent(
    userId,
    new Date('2022-01-01')
  );

  await listener.onMessage(newer, msg);
  await listener.onMessage(older, msg);

  const points = await Point.find({ userId }).sort('date');
  expect(points.length).toEqual(2);
  expect(points[0].asset).toEqual(-8);
  expect(points[1].asset).toEqual(-16);
});

it('picks up past data point', async () => {
  const listener = new TransactionUpdatedListener(natsWrapper.client);
  const userId = rand();

  // create a fake data event
  const older: TransactionUpdatedEvent['data'] = getTransactionUpdatedEvent(
    userId,
    new Date('2021-01-01')
  );

  const newer: TransactionUpdatedEvent['data'] = getTransactionUpdatedEvent(
    userId,
    new Date('2022-01-01')
  );

  await listener.onMessage(older, msg);
  await listener.onMessage(newer, msg);

  const points = await Point.find({ userId }).sort('date');
  expect(points.length).toEqual(2);
  expect(points[0].asset).toEqual(-8);
  expect(points[1].asset).toEqual(-16);
});
