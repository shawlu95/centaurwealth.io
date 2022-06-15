import { Message } from 'node-nats-streaming';
import {
  Entry,
  Subjects,
  Listener,
  NotFoundError,
  TransactionDeletedEvent,
  EntryType,
} from '@bookkeeping/common';
import { queueGroupName } from './queue-group-name';
import { Account } from '../../models/account';

export class TransactionDeletedListener extends Listener<TransactionDeletedEvent> {
  readonly subject = Subjects.TransactionDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: TransactionDeletedEvent['data'], msg: Message) {
    for (var i in data.entries) {
      const entry: Entry = data.entries[i];
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

    msg.ack();
  }
}
