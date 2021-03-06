import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { UserSignupListener } from '../user-signup-listener';
import { AccountType, UserSignupEvent } from '@bookkeeping/common';
import { Account } from '../../../model/account';

it('creates default accounts when users signs up', async () => {
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

  const before = await Account.find({ userId });
  expect(before.length).toEqual(0);

  expect(msg.ack).not.toHaveBeenCalled();

  await listener.onMessage(data, msg);

  const after = await Account.find({ userId });
  expect(after.length).toEqual(8);

  expect(msg.ack).toHaveBeenCalled();

  for (var i in after) {
    const account = after[i];
    if (account.name === 'Expense') {
      expect(account.mutable).toBeFalsy();
    } else {
      expect(account.mutable).toBeTruthy();
    }

    if (account.type === AccountType.Temporary) {
      expect(account.close).toEqual(new Date('1970-01-01'));
    } else {
      expect(account.close).toBeUndefined();
    }
  }
});
