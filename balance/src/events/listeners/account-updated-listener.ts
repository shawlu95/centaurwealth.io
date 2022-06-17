import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  AccountUpdatedEvent,
  NotFoundError,
} from '@bookkeeping/common';
import { queueGroupName } from './queue-group-name';
import { Account } from '../../models/account';

export class AccountUpdatedListener extends Listener<AccountUpdatedEvent> {
  readonly subject = Subjects.AccountUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: AccountUpdatedEvent['data'], msg: Message) {
    const account = await Account.findById(data.id);
    if (!account) {
      throw new NotFoundError();
    }
    account.set({ name: data.name });
    await account.save();
    msg.ack();
  }
}
