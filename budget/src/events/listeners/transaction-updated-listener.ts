import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  TransactionUpdatedEvent,
} from '@bookkeeping/common';
import { queueGroupName } from './queue-group-name';
import { Expense } from '../../models/expense';
import { accumulateExpense } from './utils';

export class TransactionUpdatedListener extends Listener<TransactionUpdatedEvent> {
  readonly subject = Subjects.TransactionUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TransactionUpdatedEvent['data'], msg: Message) {
    const expenseAmount = accumulateExpense(data.entries.new);

    if (expenseAmount == 0) {
      await Expense.findByIdAndDelete(data.id);
    } else {
      var expense = await Expense.findById(data.id);
      if (expense) {
        expense.set({ amount: expenseAmount });
      } else {
        // @ts-ignore
        expense = Expense.build({
          id: data.id,
          userId: data.userId,
          memo: data.memo,
          date: data.date,
          amount: expenseAmount,
        });
      }
      await expense!.save();
    }

    msg.ack();
  }
}
