import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { Expense } from '../../models/expense';
import { setup } from './test-utils';

it('returns 401 when not signed in', async () => {
  const { budget } = await setup();
  await request(app)
    .get(`/api/budget/${budget.id}?page=1&limit=10`)
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 401 if budget is not owned', async () => {
  const { budget } = await setup();
  await request(app)
    .get(`/api/budget/${budget.id}?page=1&limit=10`)
    .set('Cookie', global.signin())
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 404 if budget is not found', async () => {
  const { budget } = await setup();
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/budget/${id}?page=1&limit=10`)
    .set('Cookie', global.signin(budget.userId))
    .send()
    .expect(StatusCodes.NOT_FOUND);
});

it('returns a single budget and associated expenses', async () => {
  const { budget, expense } = await setup();

  //@ts-ignore
  const expense2 = Expense.build({
    userId: budget.userId,
    budgetId: new mongoose.Types.ObjectId().toHexString(),
    amount: 10,
    date: new Date('2022-01-01'),
    memo: 'something else',
  });
  await expense2.save();

  const { body } = await request(app)
    .get(`/api/budget/${budget.id}?page=1&limit=10`)
    .set('Cookie', global.signin(budget.userId))
    .send()
    .expect(StatusCodes.OK);

  expect(body.budget.id).toEqual(budget.id);
  expect(body.expenses.docs.length).toEqual(1);
  expect(body.expenses.docs[0].id).toEqual(expense.id);
});
