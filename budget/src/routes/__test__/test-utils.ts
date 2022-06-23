import mongoose from 'mongoose';
import { Budget } from '../../models/budget';
import { Expense } from '../../models/expense';

export const data = {
  name: 'Grocery',
  monthly: 1000,
};

export const setup = async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const budget = Budget.build({ ...data, userId });
  await budget.save();

  //@ts-ignore
  const expense = Expense.build({
    userId: budget.userId,
    budgetId: budget.id,
    amount: 10,
    date: new Date('2022-01-01'),
    memo: 'boba',
  });
  await expense.save();

  return { budget, expense };
};
