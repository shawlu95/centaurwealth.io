import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { UserSignupListener } from '../user-signup-listener';
import { UserSignupEvent } from '@bookkeeping/common';
import { Budget } from '../../../models/budget';

it('adjusts asset and liability for user', async () => {
  // create a listener isntance
  const listener = new UserSignupListener(natsWrapper.client);
  const userId = new mongoose.Types.ObjectId().toHexString();

  // create a fake data event
  const data: UserSignupEvent['data'] = {
    id: userId,
    email: 'test@test/.com',
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  const before = await Budget.find({ userId });
  expect(before.length).toEqual(0);

  expect(msg.ack).not.toHaveBeenCalled();

  await listener.onMessage(data, msg);

  const after = await Budget.find({ userId });
  expect(after.length).toEqual(1);

  const budget = after[0];
  expect(budget.name).toEqual('Default');
  expect(msg.ack).toHaveBeenCalled();
});
