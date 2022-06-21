import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  TransactionCreatedEvent,
} from '@bookkeeping/common';
import { queueGroupName } from './queue-group-name';
import { Expense } from '../../models/expense';
import { accumulateExpense } from './utils';

export class TransactionCreatedListener extends Listener<TransactionCreatedEvent> {
  readonly subject = Subjects.TransactionCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TransactionCreatedEvent['data'], msg: Message) {
    var expenseAmount = accumulateExpense(data.entries);
    if (expenseAmount != 0) {
      // @ts-ignore
      const expense = Expense.build({
        id: data.id,
        userId: data.userId,
        memo: data.memo,
        date: data.date,
        amount: expenseAmount,
      });

      await expense.save();
    }

    msg.ack();
  }
}
