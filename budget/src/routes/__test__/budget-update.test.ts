import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { Budget } from '../../models/budget';

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
  const { budget } = await setup();
  await request(app)
    .patch(`/api/budget/${budget.id}`)
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 401 if not owner', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const { budget } = await setup();
  await request(app)
    .patch(`/api/budget/${budget.id}`)
    .set('Cookie', global.signin(userId))
    .send({ monthly: 10 })
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 404 if no id', async () => {
  const { budget } = await setup();
  await request(app)
    .patch(`/api/budget/`)
    .set('Cookie', global.signin(budget.id))
    .send({ monthly: 10 })
    .expect(StatusCodes.NOT_FOUND);
});

it('returns 404 if not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const { budget } = await setup();
  await request(app)
    .patch(`/api/budget/${id}`)
    .set('Cookie', global.signin(budget.id))
    .send({ monthly: 10 })
    .expect(StatusCodes.NOT_FOUND);
});

it('returns 200 after updating budget name', async () => {
  const { budget } = await setup();
  await request(app)
    .patch(`/api/budget/${budget.id}`)
    .set('Cookie', global.signin(budget.userId))
    .send({ name: 'Travel' })
    .expect(StatusCodes.OK);

  const updated = await Budget.findById(budget.id);
  expect(updated).toBeDefined();
  expect(updated!.name).toEqual('Travel');
  expect(updated!.monthly).toEqual(1000);
  expect(updated!.quarterly).toEqual(3000);
  expect(updated!.semiannual).toEqual(6000);
  expect(updated!.annual).toEqual(12000);
});

it('returns 200 after updating monthly budget', async () => {
  const { budget } = await setup();
  await request(app)
    .patch(`/api/budget/${budget.id}`)
    .set('Cookie', global.signin(budget.userId))
    .send({ monthly: 10 })
    .expect(StatusCodes.OK);

  const updated = await Budget.findById(budget.id);
  expect(updated).toBeDefined();
  expect(updated!.name).toEqual('Grocery');
  expect(updated!.monthly).toEqual(10);
  expect(updated!.quarterly).toEqual(3000);
  expect(updated!.semiannual).toEqual(6000);
  expect(updated!.annual).toEqual(12000);
});

it('returns 200 after updating quarterly budget', async () => {
  const { budget } = await setup();
  await request(app)
    .patch(`/api/budget/${budget.id}`)
    .set('Cookie', global.signin(budget.userId))
    .send({ quarterly: 10 })
    .expect(StatusCodes.OK);

  const updated = await Budget.findById(budget.id);
  expect(updated).toBeDefined();
  expect(updated!.name).toEqual('Grocery');
  expect(updated!.monthly).toEqual(1000);
  expect(updated!.quarterly).toEqual(10);
  expect(updated!.semiannual).toEqual(6000);
  expect(updated!.annual).toEqual(12000);
});

it('returns 200 after updating semiannual budget', async () => {
  const { budget } = await setup();
  await request(app)
    .patch(`/api/budget/${budget.id}`)
    .set('Cookie', global.signin(budget.userId))
    .send({ semiannual: 10 })
    .expect(StatusCodes.OK);

  const updated = await Budget.findById(budget.id);
  expect(updated).toBeDefined();
  expect(updated!.name).toEqual('Grocery');
  expect(updated!.monthly).toEqual(1000);
  expect(updated!.quarterly).toEqual(3000);
  expect(updated!.semiannual).toEqual(10);
  expect(updated!.annual).toEqual(12000);
});

it('returns 200 after updating annual budget', async () => {
  const { budget } = await setup();
  await request(app)
    .patch(`/api/budget/${budget.id}`)
    .set('Cookie', global.signin(budget.userId))
    .send({ annual: 10 })
    .expect(StatusCodes.OK);

  const updated = await Budget.findById(budget.id);
  expect(updated).toBeDefined();
  expect(updated!.name).toEqual('Grocery');
  expect(updated!.monthly).toEqual(1000);
  expect(updated!.quarterly).toEqual(3000);
  expect(updated!.semiannual).toEqual(6000);
  expect(updated!.annual).toEqual(10);
});
