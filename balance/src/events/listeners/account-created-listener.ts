import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  AccountCreatedEvent,
  AccountType,
} from '@bookkeeping/common';
import { queueGroupName } from './queue-group-name';
import { Account } from '../../models/account';

export class AccountCreatedListener extends Listener<AccountCreatedEvent> {
  readonly subject = Subjects.AccountCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: AccountCreatedEvent['data'], msg: Message) {
    const account = Account.build(data);
    await account.save();
    msg.ack();
  }
}
