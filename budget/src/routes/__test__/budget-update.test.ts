import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { Budget } from '../../models/budget';
import { setup } from './test-utils';

it('returns 401 when not signed in', async () => {
  const { budget } = await setup();
  await request(app)
    .patch(`/api/budget/${budget.id}`)
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 400 if name is not provided', async () => {
  const { budget } = await setup();
  await request(app)
    .patch(`/api/budget/${budget.id}`)
    .set('Cookie', global.signin(budget.userId))
    .send({ monthly: budget.monthly })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 400 if amount is not provided', async () => {
  const { budget } = await setup();
  await request(app)
    .patch(`/api/budget/${budget.id}`)
    .set('Cookie', global.signin(budget.userId))
    .send({ name: budget.name })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 400 if monthly budget is zero', async () => {
  const { budget } = await setup();
  await request(app)
    .patch(`/api/budget/${budget.id}`)
    .set('Cookie', global.signin(budget.userId))
    .send({ name: budget.name, monthly: 0 })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 400 if monthly budget is negative', async () => {
  const { budget } = await setup();
  await request(app)
    .patch(`/api/budget/${budget.id}`)
    .set('Cookie', global.signin(budget.userId))
    .send({ name: budget.name, monthly: -10 })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 400 if monthly budget is not number', async () => {
  const { budget } = await setup();
  await request(app)
    .patch(`/api/budget/${budget.id}`)
    .set('Cookie', global.signin(budget.userId))
    .send({ name: budget.name, monthly: 'foo' })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 401 if not owner', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const { budget } = await setup();
  await request(app)
    .patch(`/api/budget/${budget.id}`)
    .set('Cookie', global.signin(userId))
    .send({ name: budget.name, monthly: 10 })
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 404 if no id', async () => {
  const { budget } = await setup();
  await request(app)
    .patch(`/api/budget/`)
    .set('Cookie', global.signin(budget.id))
    .send({ name: budget.name, monthly: 10 })
    .expect(StatusCodes.NOT_FOUND);
});

it('returns 404 if not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const { budget } = await setup();
  await request(app)
    .patch(`/api/budget/${id}`)
    .set('Cookie', global.signin(budget.id))
    .send({ name: budget.name, monthly: 10 })
    .expect(StatusCodes.NOT_FOUND);
});

it('returns 400 if budget is duplicate name', async () => {
  const { budget } = await setup();

  const budgetB = Budget.build({
    name: 'budgetB',
    monthly: 10,
    userId: budget.userId,
  });
  await budgetB.save();

  await request(app)
    .patch(`/api/budget/${budget.id}`)
    .set('Cookie', global.signin(budget.userId))
    .send({ name: 'budgetB', monthly: 10 })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 200 if budget is same name as itself', async () => {
  const { budget } = await setup();
  await request(app)
    .patch(`/api/budget/${budget.id}`)
    .set('Cookie', global.signin(budget.userId))
    .send({ name: budget.name, monthly: 10 })
    .expect(StatusCodes.OK);
});

it('returns 400 if trying to update immutable budget name', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const budget = Budget.build({
    userId,
    name: 'Default',
    monthly: 10000,
    mutable: false,
  });
  await budget.save();

  await request(app)
    .patch(`/api/budget/${budget.id}`)
    .set('Cookie', global.signin(budget.userId))
    .send({ name: 'Grocery', monthly: 10 })
    .expect(StatusCodes.BAD_REQUEST);

  const updated = await Budget.findById(budget.id);
  expect(updated).toBeDefined();
  expect(updated!.name).toEqual('Default');
});

it('returns 200 after updating immutable budget amount', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const budget = Budget.build({
    userId,
    name: 'Default',
    monthly: 10000,
    mutable: false,
  });
  await budget.save();

  await request(app)
    .patch(`/api/budget/${budget.id}`)
    .set('Cookie', global.signin(budget.userId))
    .send({ name: budget.name, monthly: 10 })
    .expect(StatusCodes.OK);

  const updated = await Budget.findById(budget.id);
  expect(updated).toBeDefined();
  expect(updated!.monthly).toEqual(10);
});

it('returns 200 after updating budget name', async () => {
  const { budget } = await setup();
  await request(app)
    .patch(`/api/budget/${budget.id}`)
    .set('Cookie', global.signin(budget.userId))
    .send({ name: 'Travel', monthly: budget.monthly })
    .expect(StatusCodes.OK);

  const updated = await Budget.findById(budget.id);
  expect(updated).toBeDefined();
  expect(updated!.name).toEqual('Travel');
  expect(updated!.monthly).toEqual(1000);
  expect(updated!.quarterly).toEqual(3000);
  expect(updated!.annual).toEqual(12000);
});

it('returns 200 after updating monthly budget name and amount', async () => {
  const { budget } = await setup();
  await request(app)
    .patch(`/api/budget/${budget.id}`)
    .set('Cookie', global.signin(budget.userId))
    .send({ name: 'Food', monthly: 10 })
    .expect(StatusCodes.OK);

  const updated = await Budget.findById(budget.id);
  expect(updated).toBeDefined();
  expect(updated!.name).toEqual('Food');
  expect(updated!.monthly).toEqual(10);
  expect(updated!.quarterly).toEqual(30);
  expect(updated!.annual).toEqual(120);
});
