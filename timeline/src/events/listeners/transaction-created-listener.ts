import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  AccountType,
  TransactionCreatedEvent,
} from '@bookkeeping/common';
import { queueGroupName } from './queue-group-name';
import { Point } from '../../model/point';
import { getDelta } from '../util';

export class TransactionCreatedListener extends Listener<TransactionCreatedEvent> {
  readonly subject = Subjects.TransactionCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TransactionCreatedEvent['data'], msg: Message) {
    const userId = data.userId;
    const date = new Date(data.date);

    var asset = getDelta(AccountType.Asset, data.entries);
    var liability = getDelta(AccountType.Liability, data.entries);

    const query = { userId, date, asset, liability };
    await Point.updateCurrent(query);
    await Point.updateFuture(query);

    msg.ack();
  }
}
