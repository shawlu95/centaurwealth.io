import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  AccountType,
  TransactionDeletedEvent,
} from '@bookkeeping/common';
import { queueGroupName } from './queue-group-name';
import { Point } from '../../model/point';
import { getDelta } from '../util';

export class TransactionDeletedListener extends Listener<TransactionDeletedEvent> {
  readonly subject = Subjects.TransactionDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: TransactionDeletedEvent['data'], msg: Message) {
    const userId = data.userId;
    const date = new Date(data.date);

    var assetDelta = getDelta(AccountType.Asset, data.entries);
    var liabilityDelta = getDelta(AccountType.Liability, data.entries);

    const query = { userId, date };
    const update = { expire: new Date() };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    var point = await Point.findOneAndUpdate(query, update, options);

    point?.set({
      asset: point.asset - assetDelta,
      liability: point.liability - liabilityDelta,
    });

    await point?.save();

    msg.ack();
  }
}
