import { Message } from 'node-nats-streaming';
import {
  Entry,
  Subjects,
  Listener,
  AccountUpdatedEvent,
  AccountType,
  NotFoundError,
  TransactionUpdatedEvent,
  EntryType,
} from '@bookkeeping/common';
import { queueGroupName } from './queue-group-name';
import { Account } from '../../models/account';
import { Transaction } from '../../models/transaction';

export class TransactionUpdatedListener extends Listener<TransactionUpdatedEvent> {
  readonly subject = Subjects.TransactionUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TransactionUpdatedEvent['data'], msg: Message) {
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

    for (var i in data.entries) {
      const entry: Entry = data.entries[i];
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

      old.set({
        memo: data.memo,
        date: new Date(data.date),
        entries: data.entries,
      });
      await old.save();

      await account.save();
    }

    msg.ack();
  }
}
