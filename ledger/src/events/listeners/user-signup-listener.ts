import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  AccountType,
  UserSignupEvent,
} from '@bookkeeping/common';
import { AccountCreatedPublisher } from '../publishers/account-created-publisher';
import { queueGroupName } from './queue-group-name';
import { Account } from '../../model/account';
import { natsWrapper } from '../../nats-wrapper';

const defaultAccounts = {
  asset: ['Checking Account', 'Savings Account', 'Cash'],
  liability: ['Credit Card Debt', 'Loan'],
  equity: ['Retained Earning'],
  temporary: ['Expense', 'Salary'],
};

const immutable = new Set(['Expense']);

export class UserSignupListener extends Listener<UserSignupEvent> {
  readonly subject = Subjects.UserSignup;
  queueGroupName = queueGroupName;

  async onMessage(data: UserSignupEvent['data'], msg: Message) {
    const userId = data.id;
    const publisher = new AccountCreatedPublisher(natsWrapper.client);

    for (const [type, names] of Object.entries(defaultAccounts)) {
      for (var i in names) {
        const name = names[i];
        const account = Account.build({
          userId,
          name,
          type: type as AccountType,
          mutable: !immutable.has(name),
        });
        await account.save();

        publisher.publish({
          id: account.id,
          userId: account.userId,
          name: account.name,
          type: account.type,
        });
      }
    }

    msg.ack();
  }
}
