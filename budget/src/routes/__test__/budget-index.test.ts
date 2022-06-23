import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { setup } from './test-utils';
import { Expense } from '../../models/expense';

it('returns 401 when not signed in', async () => {
  await request(app)
    .get(`/api/budget?page=1&limit=10`)
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns list of budget for user', async () => {
  const { budget, expense } = await setup();

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

it('returns 404 if budgetId is passed in and not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/budget?page=1&limit=10&budgetId=${id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(StatusCodes.NOT_FOUND);
});

it('returns 401 if budgetId is passed in and not owned', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const { budget } = await setup();

  await request(app)
    .get(`/api/budget?page=1&limit=10&budgetId=${budget.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns filtered expense if budgetId is passed in', async () => {
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
    .get(`/api/budget?page=1&limit=10&budgetId=${budget.id}`)
    .set('Cookie', global.signin(budget.userId))
    .send()
    .expect(StatusCodes.OK);

  expect(body.expenses.docs.length).toEqual(1);
  expect(body.expenses.docs[0].id).toEqual(expense.id);
});
