import request from 'supertest';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import {
  buildAccountPair,
  buildTransactionEvent,
} from '../../events/listeners/__test__/transaction-test-util';

it('returns 401 when not signed in', async () => {
  await request(app)
    .get('/api/balance/current')
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 200 and list of accounts', async () => {
  const { userId } = await buildAccountPair();

  const {
    body: { accounts, summary },
  } = await request(app)
    .get('/api/balance/current')
    .set('Cookie', global.signin(userId))
    .send()
    .expect(StatusCodes.OK);

  expect(summary).toEqual([
    { credit: 0, debit: 0, type: 'asset', balance: 0, count: 1 },
    { credit: 0, debit: 0, type: 'temporary', balance: 0, count: 1 },
  ]);

  expect(accounts.length).toEqual(2);
  expect(accounts[0].userId).toEqual(userId);
  expect(accounts[1].userId).toEqual(userId);
});

it('returns 200 with account group summary', async () => {
  const { cash, expense, listener, data, msg } = await buildTransactionEvent();
  await listener.onMessage(data, msg);

  const {
    body: { summary },
  } = await request(app)
    .get('/api/balance/current')
    .set('Cookie', global.signin(data.userId))
    .send()
    .expect(StatusCodes.OK);

  expect(summary).toEqual([
    { credit: -10, debit: 0, type: 'asset', balance: 10, count: 1 },
    { credit: 0, debit: -10, type: 'temporary', balance: 10, count: 1 },
  ]);
});
