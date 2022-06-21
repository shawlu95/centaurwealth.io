import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { AccountClosedListener } from '../account-closed-listener';
import { AccountClosedEvent, AccountType } from '@bookkeeping/common';
import { Account } from '../../../model/account';

it('update close field on temporary account', async () => {
  // create a listener isntance
  const listener = new AccountClosedListener(natsWrapper.client);
  const userId = new mongoose.Types.ObjectId().toHexString();

  const account = Account.build({
    userId,
    name: 'expense',
    type: AccountType.Temporary,
  });
  await account.save();

  const date = new Date('2022-01-01');

  // create a fake data event
  const data: AccountClosedEvent['data'] = {
    id: account.id,
    userId,
    date,
    name: account.name,
    type: account.type,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  expect(msg.ack).not.toHaveBeenCalled();

  await listener.onMessage(data, msg);

  const updated = await Account.findById(account.id);
  expect(updated).toBeDefined();
  expect(updated!.close).toEqual(date);
  expect(msg.ack).toHaveBeenCalled();
});
