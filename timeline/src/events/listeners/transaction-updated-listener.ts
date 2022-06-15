import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  AccountType,
  TransactionUpdatedEvent,
} from '@bookkeeping/common';
import { queueGroupName } from './queue-group-name';
import { Point } from '../../model/point';
import { getDelta } from '../util';

export class TransactionUpdatedListener extends Listener<TransactionUpdatedEvent> {
  readonly subject = Subjects.TransactionUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TransactionUpdatedEvent['data'], msg: Message) {
    const userId = data.userId;
    const date = new Date(data.date);

    var assetDelta =
      getDelta(AccountType.Asset, data.entries.new) -
      getDelta(AccountType.Asset, data.entries.old);
    var liabilityDelta =
      getDelta(AccountType.Liability, data.entries.new) -
      getDelta(AccountType.Liability, data.entries.old);

    const query = { userId, date };
    const update = { expire: new Date() };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    await Point.findOneAndUpdate(query, update, options);

    const points = await Point.find({ userId, date: { $gte: date } });
    for (var i in points) {
      const point = points[i];
      point.set({
        asset: point.asset + assetDelta,
        liability: point.liability + liabilityDelta,
      });
      await point.save();
    }

    msg.ack();
  }
}
