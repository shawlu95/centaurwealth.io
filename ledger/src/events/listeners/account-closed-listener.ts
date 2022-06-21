import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  AccountClosedEvent,
  NotFoundError,
} from '@bookkeeping/common';
import { queueGroupName } from './queue-group-name';
import { Account } from '../../model/account';

export class AccountClosedListener extends Listener<AccountClosedEvent> {
  readonly subject = Subjects.AccountClosed;
  queueGroupName = queueGroupName;

  async onMessage(data: AccountClosedEvent['data'], msg: Message) {
    const account = await Account.findById(data.id);

    if (!account) {
      throw new NotFoundError();
    }

    account.set({ close: data.date });
    await account.save();

    msg.ack();
  }
}
