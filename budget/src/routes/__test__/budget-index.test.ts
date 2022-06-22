import request from 'supertest';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { setup } from './test-utils';

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
