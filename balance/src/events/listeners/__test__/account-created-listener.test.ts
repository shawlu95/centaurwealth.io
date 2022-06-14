import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { AccountCreatedListener } from '../account-created-listener';
import { AccountCreatedEvent, AccountType } from '@bookkeeping/common';
import mongoose from 'mongoose';
import { Account } from '../../../models/account';

const setup = async () => {
  // create a listener isntance
  const listener = new AccountCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: AccountCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    name: 'cash',
    type: AccountType.Asset,
  };

  // create a fake message with fake ack function
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage
  await listener.onMessage(data, msg);

  // check ticket has been created
  const ticket = await Account.findById(data.id);

  expect(ticket).not.toBeNull();
  expect(ticket!.name).toEqual(data.name);
  expect(ticket!.type).toEqual(data.type);
  expect(ticket!.userId).toEqual(data.userId);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
