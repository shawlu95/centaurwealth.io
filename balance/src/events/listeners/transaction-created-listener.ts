import { Message } from 'node-nats-streaming';
import {
  Entry,
  Subjects,
  Listener,
  AccountUpdatedEvent,
  AccountType,
  NotFoundError,
  TransactionCreatedEvent,
  EntryType,
} from '@bookkeeping/common';
import { queueGroupName } from './queue-group-name';
import { Account } from '../../models/account';
import { Transaction } from '../../models/transaction';

export class TransactionCreatedListener extends Listener<TransactionCreatedEvent> {
  readonly subject = Subjects.TransactionCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TransactionCreatedEvent['data'], msg: Message) {
    const transaction = Transaction.build({
      ...data,
      date: new Date(data.date),
    });
    await transaction.save();

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
    }

    msg.ack();
  }
}
