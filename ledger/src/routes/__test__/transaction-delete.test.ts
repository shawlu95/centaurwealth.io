import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { natsWrapper } from '../../nats-wrapper';
import { Transaction } from '../../model/transaction';
import { buildTransaction } from './transaction-test-util';

it('returns 400 if not signed in', async () => {
  await request(app)
    .delete('/api/transaction')
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 400 if id is missing', async () => {
  await request(app)
    .delete('/api/transaction')
    .set('Cookie', global.signin())
    .send()
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 404 if transaction is not found', async () => {
  const randomId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .delete('/api/transaction')
    .set('Cookie', global.signin())
    .send({ id: randomId })
    .expect(StatusCodes.NOT_FOUND);
});

it('returns 401 if not owner of transaction', async () => {
  const { transaction } = await buildTransaction();
  await request(app)
    .delete('/api/transaction')
    .set('Cookie', global.signin())
    .send({ id: transaction.id })
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 200 if delete successfully', async () => {
  const { userId, transaction } = await buildTransaction();
  await request(app)
    .delete('/api/transaction')
    .set('Cookie', global.signin(userId))
    .send({ id: transaction.id })
    .expect(StatusCodes.OK);

  const deleted = await Transaction.findById(transaction.id);
  expect(deleted).toBeNull();
});
