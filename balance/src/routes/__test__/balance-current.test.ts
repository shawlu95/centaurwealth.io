import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { natsWrapper } from '../../nats-wrapper';
import { Account, AccountType } from '../../models/account';
import { buildTransaction } from '../../events/listeners/__test__/transaction-test-util';

it('returns 401 when not signed in', async () => {
  await request(app)
    .get('/api/balance/current')
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 200 and list of accounts', async () => {
  const { userId } = await buildTransaction();

  const {
    body: { accounts },
  } = await request(app)
    .get('/api/balance/current')
    .set('Cookie', global.signin(userId))
    .send()
    .expect(StatusCodes.OK);

  expect(accounts.length).toEqual(2);
  expect(accounts[0].userId).toEqual(userId);
  expect(accounts[1].userId).toEqual(userId);
});
