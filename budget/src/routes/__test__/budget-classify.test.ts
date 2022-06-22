import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { Expense } from '../../models/expense';
import { setup } from './test-utils';

it('returns 401 when not signed in', async () => {
  await request(app)
    .post('/api/budget/classify')
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 400 if budget id is not provided', async () => {
  const expenseId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .post(`/api/budget/classify`)
    .set('Cookie', global.signin())
    .send({ expenseId })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 400 if expense id is not provided', async () => {
  const budgetId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .post(`/api/budget/classify`)
    .set('Cookie', global.signin())
    .send({ budgetId })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 404 if budget is not found', async () => {
  const { expense } = await setup();
  await request(app)
    .post(`/api/budget/classify`)
    .set('Cookie', global.signin())
    .send({
      budgetId: new mongoose.Types.ObjectId().toHexString(),
      expenseId: expense.id,
    })
    .expect(StatusCodes.NOT_FOUND);
});

it('returns 404 if expense is not found', async () => {
  const { budget } = await setup();
  await request(app)
    .post(`/api/budget/classify`)
    .set('Cookie', global.signin())
    .send({
      budgetId: budget.id,
      expenseId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(StatusCodes.NOT_FOUND);
});

it('returns 200 if successful', async () => {
  const { budget } = await setup();

  // @ts-ignore
  const expense = Expense.build({
    userId: budget.userId,
    amount: 10,
    date: new Date('2022-01-01'),
    memo: 'boba',
  });
  await expense.save();

  await request(app)
    .post(`/api/budget/classify`)
    .set('Cookie', global.signin(budget.userId))
    .send({
      budgetId: budget.id,
      expenseId: expense.id,
    })
    .expect(StatusCodes.OK);

  const updated = await Expense.findById(expense.id);
  expect(updated!.budgetId.toString()).toEqual(budget.id.toString());
});
