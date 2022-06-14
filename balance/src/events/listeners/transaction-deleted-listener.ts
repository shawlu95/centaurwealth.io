import { Message } from 'node-nats-streaming';
import {
  Entry,
  Subjects,
  Listener,
  AccountUpdatedEvent,
  AccountType,
  NotFoundError,
  TransactionDeletedEvent,
  EntryType,
} from '@bookkeeping/common';
import { queueGroupName } from './queue-group-name';
import { Account } from '../../models/account';
import { Transaction } from '../../models/transaction';

export class TransactionDeletedListener extends Listener<TransactionDeletedEvent> {
  readonly subject = Subjects.TransactionDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: TransactionDeletedEvent['data'], msg: Message) {
    const old = await Transaction.findById(data.id);

    if (!old) throw new NotFoundError();

    for (var i in old.entries) {
      const entry: Entry = old.entries[i];
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

    await Transaction.deleteOne({ id: data.id });

    msg.ack();
  }
}
