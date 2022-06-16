import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { EntryType } from '@bookkeeping/common';
import { Account, AccountType } from '../../model/account';
import { Transaction } from '../../model/transaction';
import { buildTransaction } from './transaction-test-util';

it('returns 400 if not signed in', async () => {
  await request(app)
    .get('/api/transaction')
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 400 if not signed in', async () => {
  await request(app)
    .get('/api/transaction/foo')
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns transactions of signed-in user', async () => {
  const { userId } = await buildTransaction();

  const {
    body: { transactions },
  } = await request(app)
    .get('/api/transaction')
    .set('Cookie', global.signin(userId))
    .send()
    .expect(StatusCodes.OK);
  expect(transactions).toBeDefined();
  expect(transactions.length).toEqual(1);
  expect(transactions[0].userId).toEqual(userId);
  expect(transactions[0].memo).toEqual('beer');
  expect(transactions[0].entries.length).toEqual(2);
  expect(transactions[0].entries[0].amount).toEqual(10);
});

it('returns 401 if account does not belong to user', async () => {
  const { transaction } = await buildTransaction();

  await request(app)
    .get('/api/transaction/' + transaction.id)
    .set('Cookie', global.signin())
    .expect(StatusCodes.UNAUTHORIZED);
});

it('return account with matching id', async () => {
  const { userId, transaction } = await buildTransaction();

  const {
    body: { transaction: transactionRead },
  } = await request(app)
    .get('/api/transaction/' + transaction.id)
    .set('Cookie', global.signin(userId))
    .expect(StatusCodes.OK);

  expect(transactionRead.id).toEqual(transaction.id);
  expect(transactionRead.userId).toEqual(userId);
  expect(transactionRead.memo).toEqual(transaction.memo);
});
