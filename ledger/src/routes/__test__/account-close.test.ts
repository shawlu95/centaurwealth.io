import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { Account, AccountType } from '../../model/account';
import { buildTransaction } from './transaction-test-util';
import { EntryType } from '@bookkeeping/common';

it('returns 401 if not signed in', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/account/close/${id}?lte=2022-01-02`)
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 401 if trying to close non-temporary account', async () => {
  const { userId, cash } = await buildTransaction();
  await request(app)
    .get(`/api/account/close/${cash.id}?lte=2022-01-02`)
    .set('Cookie', global.signin(userId))
    .send()
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 404 if not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/account/close/${id}?lte=2022-01-02`)
    .set('Cookie', global.signin())
    .send()
    .expect(StatusCodes.NOT_FOUND);
});

it('returns 401 if trying to close others account', async () => {
  const { expense } = await buildTransaction();
  await request(app)
    .get(`/api/account/close/${expense.id}?lte=2022-01-02`)
    .set('Cookie', global.signin())
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 400 if nothing to close', async () => {
  const { userId, expense } = await buildTransaction();
  await request(app)
    .get(`/api/account/close/${expense.id}?lte=2022-01-01`)
    .set('Cookie', global.signin(userId))
    .send()
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 200 if closing successfully', async () => {
  await buildTransaction();
  const { userId, expense, cash } = await buildTransaction();

  const {
    body: { transaction },
  } = await request(app)
    .get(`/api/account/close/${expense.id}?lte=2022-01-02`)
    .set('Cookie', global.signin(userId))
    .send()
    .expect(StatusCodes.OK);
  expect(transaction.entries.length).toEqual(1);
  expect(transaction.entries[0].amount).toEqual(10);
  expect(transaction.entries[0].type).toEqual(EntryType.Credit);
});
