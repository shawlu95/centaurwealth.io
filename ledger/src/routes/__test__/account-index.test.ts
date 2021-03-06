import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { Account, AccountType } from '../../model/account';
import { buildTransaction } from './test-utils';

it('returns 401 if not signed in', async () => {
  await request(app)
    .get('/api/account')
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns a list of owned account', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const account = Account.build({
    userId,
    name: 'cash',
    type: AccountType.Asset,
  });
  await account.save();

  const {
    body: { accounts },
  } = await request(app)
    .get('/api/account')
    .set('Cookie', global.signin(userId))
    .send()
    .expect(StatusCodes.OK);

  expect(accounts).toBeDefined();
  expect(accounts.length).toEqual(1);
  expect(accounts[0].userId).toEqual(userId);
  expect(accounts[0].type).toEqual('asset');
  expect(accounts[0].name).toEqual('cash');
});

it('returns associated transactions of an account', async () => {
  const { userId, cash, expense, transaction } = await buildTransaction();

  const {
    body: { account, transactions },
  } = await request(app)
    .get(`/api/account/${cash.id}?page=1&limit=10`)
    .set('Cookie', global.signin(userId))
    .send()
    .expect(StatusCodes.OK);

  expect(account.userId).toEqual(userId);
  expect(account.type).toEqual('asset');
  expect(account.name).toEqual('cash');

  expect(transactions.docs.length).toEqual(1);
  expect(transactions.docs[0].userId).toEqual(userId);
  expect(transactions.docs[0].memo).toEqual(transaction.memo);
  expect(transactions.docs[0].credit).toEqual(10);
  expect(transactions.docs[0].debit).toEqual(0);
});
