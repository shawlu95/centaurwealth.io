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

    var asset =
      getDelta(AccountType.Asset, data.entries.new) -
      getDelta(AccountType.Asset, data.entries.old);
    var liability =
      getDelta(AccountType.Liability, data.entries.new) -
      getDelta(AccountType.Liability, data.entries.old);

    const query = { userId, date, asset, liability };
    await Point.updateCurrent(query);
    await Point.updateFuture(query);

    msg.ack();
  }
}
