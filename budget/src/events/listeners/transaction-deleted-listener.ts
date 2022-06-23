import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  TransactionDeletedEvent,
} from '@bookkeeping/common';
import { queueGroupName } from './queue-group-name';
import { Expense } from '../../models/expense';

export class TransactionDeletedListener extends Listener<TransactionDeletedEvent> {
  readonly subject = Subjects.TransactionDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: TransactionDeletedEvent['data'], msg: Message) {
    await Expense.findByIdAndDelete(data.id);
    msg.ack();
  }
}
