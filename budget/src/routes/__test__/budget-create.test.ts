import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { Budget } from '../../models/budget';
import { data } from './test-utils';

it('returns 401 when not signed in', async () => {
  await request(app)
    .post('/api/budget')
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 400 if name is not provided', async () => {
  await request(app)
    .post('/api/budget')
    .set('Cookie', global.signin())
    .send({ ...data, name: undefined })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 400 if monthly budget is not provided', async () => {
  await request(app)
    .post('/api/budget')
    .set('Cookie', global.signin())
    .send({ ...data, monthly: undefined })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 400 if budget is duplicate name', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const budget = Budget.build({ ...data, userId });
  await budget.save();

  await request(app)
    .post('/api/budget')
    .set('Cookie', global.signin(userId))
    .send({ ...data })
    .expect(StatusCodes.BAD_REQUEST);
});

it.skip('returns 400 if budget is duplicate name', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const budget = Budget.build({ ...data, userId });
  await budget.save();

  await request(app)
    .post('/api/budget')
    .set('Cookie', global.signin(userId))
    .send({ ...data, name: 'grocery' })
    .expect(StatusCodes.BAD_REQUEST);

  const updated = await Budget.findOne({ userId });
  console.log(updated);
});

it('returns 201 if successful', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .post('/api/budget')
    .set('Cookie', global.signin(userId))
    .send(data)
    .expect(StatusCodes.CREATED);

  const budget = await Budget.findOne({ userId });
  expect(budget).toBeDefined();
  expect(budget!.name).toEqual('Grocery');
  expect(budget!.monthly).toEqual(1000);
  expect(budget!.quarterly).toEqual(3000);
  expect(budget!.annual).toEqual(12000);
});
