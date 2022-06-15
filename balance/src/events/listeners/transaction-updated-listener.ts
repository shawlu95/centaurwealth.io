import { Message } from 'node-nats-streaming';
import {
  Entry,
  Subjects,
  Listener,
  NotFoundError,
  TransactionUpdatedEvent,
  EntryType,
} from '@bookkeeping/common';
import { queueGroupName } from './queue-group-name';
import { Account } from '../../models/account';

export class TransactionUpdatedListener extends Listener<TransactionUpdatedEvent> {
  readonly subject = Subjects.TransactionUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TransactionUpdatedEvent['data'], msg: Message) {
    for (var i in data.entries.old) {
      const entry: Entry = data.entries.old[i];
      const account = await Account.findById(entry.accountId);

      if (!account) throw new NotFoundError();

      if (entry.type == EntryType.Credit) {
        account!.set({
          credit: account.credit - entry.amount,
        });
      }

      if (entry.type == EntryType.Debit) {
        account!.set({
          debit: account.debit - entry.amount,
        });
      }

      await account.save();
    }

    for (var i in data.entries.new) {
      const entry: Entry = data.entries.new[i];
      const account = await Account.findById(entry.accountId);

      if (!account) throw new NotFoundError();

      if (entry.type == EntryType.Credit) {
        account!.set({
          credit: account.credit + entry.amount,
        });
      }

      if (entry.type == EntryType.Debit) {
        account!.set({
          debit: account.debit + entry.amount,
        });
      }

      await account.save();
    }

    msg.ack();
  }
}
