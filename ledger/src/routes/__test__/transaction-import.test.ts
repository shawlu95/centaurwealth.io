import request from 'supertest';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { EntryType } from '@bookkeeping/common';
import { buildAccountPair } from './transaction-test-util';

it('returns 401 when not signed in', async () => {
  await request(app)
    .post('/api/transaction/import')
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 400 if no entry', async () => {
  const { userId } = await buildAccountPair();
  await request(app)
    .post('/api/transaction/import')
    .set('Cookie', global.signin(userId))
    .send({ transactions: [] })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 200 with successful transaction', async () => {
  const { userId, cash, expense } = await buildAccountPair();
  const data = {
    memo: 'beer',
    date: '2022-06-12',
    entries: [
      {
        amount: 10,
        type: EntryType.Credit,
        accountId: cash.id,
        accountName: cash.name,
        accountType: cash.type,
      },
      {
        amount: 10,
        type: EntryType.Debit,
        accountId: expense.id,
        accountName: expense.name,
        accountType: expense.type,
      },
    ],
  };

  const {
    body: { ids },
  } = await request(app)
    .post('/api/transaction/import')
    .set('Cookie', global.signin(userId))
    .send({ transactions: [data, data] })
    .expect(StatusCodes.OK);

  expect(ids.length).toEqual(2);
});
