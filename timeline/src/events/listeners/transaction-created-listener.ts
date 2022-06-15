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
import { Point } from '../../model/point';

export class TransactionCreatedListener extends Listener<TransactionCreatedEvent> {
  readonly subject = Subjects.TransactionCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TransactionCreatedEvent['data'], msg: Message) {
    const userId = data.userId;
    const date = new Date(data.date);

    var assetDelta = 0;
    var liabilityDelta = 0;
    for (var i in data.entries) {
      const entry: Entry = data.entries[i];

      if (entry.accountType == AccountType.Asset) {
        if (entry.type == EntryType.Credit) {
          assetDelta -= entry.amount;
        } else if (entry.type == EntryType.Debit) {
          assetDelta += entry.amount;
        }
      }

      if (entry.accountType == AccountType.Liability) {
        if (entry.type == EntryType.Credit) {
          liabilityDelta += entry.amount;
        } else if (entry.type == EntryType.Debit) {
          liabilityDelta -= entry.amount;
        }
      }
    }

    const query = { userId, date };
    const update = { expire: new Date() };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    var point = await Point.findOneAndUpdate(query, update, options);

    point?.set({
      asset: point.asset + assetDelta,
      liability: point.liability + liabilityDelta,
    });

    await point?.save();

    msg.ack();
  }
}
