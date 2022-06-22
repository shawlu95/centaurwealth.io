import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { Budget } from '../../models/budget';
import { Expense } from '../../models/expense';

const data = {
  name: 'Grocery',
  monthly: 1000,
  quarterly: 3000,
  semiannual: 6000,
  annual: 12000,
};

const setup = async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const budget = Budget.build({ ...data, userId });
  await budget.save();
  return { budget };
};

it('returns 401 when not signed in', async () => {
  await request(app)
    .get(`/api/budget?page=1&limit=10`)
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns list of budget for user', async () => {
  const { budget } = await setup();

  //@ts-ignore
  const expense = Expense.build({
    userId: budget.userId,
    budgetId: budget.id,
    amount: 10,
    date: new Date('2022-01-01'),
    memo: 'boba',
  });
  await expense.save();

  const res = await request(app)
    .get(`/api/budget?page=1&limit=10`)
    .set('Cookie', global.signin(budget.userId))
    .send();

  expect(res.body.budgets.length).toEqual(1);
  expect(res.body.budgets[0].id).toEqual(budget.id);
  expect(res.body.expenses.docs[0].id).toEqual(expense.id);
});

it('does not return non-owner budget', async () => {
  await setup();
  const res = await request(app)
    .get(`/api/budget?page=1&limit=10`)
    .set('Cookie', global.signin())
    .send();
  expect(res.body.budgets.length).toEqual(0);
});
