import { Message } from 'node-nats-streaming';
import {
  Entry,
  Subjects,
  Listener,
  NotFoundError,
  TransactionCreatedEvent,
  EntryType,
  AccountType,
} from '@bookkeeping/common';
import { queueGroupName } from './queue-group-name';
import { Account } from '../../models/account';
import { AccountClosedPublisher } from '../publishers/account-closed-publisher';
import { natsWrapper } from '../../nats-wrapper';

export class TransactionCreatedListener extends Listener<TransactionCreatedEvent> {
  readonly subject = Subjects.TransactionCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TransactionCreatedEvent['data'], msg: Message) {
    for (var i in data.entries) {
      const entry: Entry = data.entries[i];
      const account = await Account.findById(entry.accountId);

      if (!account) {
        throw new NotFoundError();
      }

      if (entry.type == EntryType.Credit) {
        account?.set({
          credit: account.credit + entry.amount,
        });
      }

      if (entry.type == EntryType.Debit) {
        account?.set({
          debit: account.debit + entry.amount,
        });
      }

      await account.save();

      if (
        account.type === AccountType.Temporary &&
        account.credit == account.debit
      ) {
        new AccountClosedPublisher(natsWrapper.client).publish({
          id: account.id,
          date: data.date,
          userId: account.userId,
          name: account.name,
          type: account.type,
        });
      }
    }

    msg.ack();
  }
}
