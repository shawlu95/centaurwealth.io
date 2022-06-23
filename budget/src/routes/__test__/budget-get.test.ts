import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
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

it('returns a single budget', async () => {
  const { budget } = await setup();

  const { body } = await request(app)
    .get(`/api/budget/${budget.id}?page=1&limit=10`)
    .set('Cookie', global.signin(budget.userId))
    .send()
    .expect(StatusCodes.OK);

  expect(body.budget.id).toEqual(budget.id);
});
