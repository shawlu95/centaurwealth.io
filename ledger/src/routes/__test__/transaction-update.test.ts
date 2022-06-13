import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { natsWrapper } from '../../nats-wrapper';
import { EntryType } from '@bookkeeping/common';
import { Account, AccountType } from '../../model/account';
import { Transaction } from '../../model/transaction';
import { buildAccountPair } from './transaction-test-util';

it('returns 400 if not signed in', async () => {
  await request(app)
    .put('/api/transaction')
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 401 if missing memo', async () => {
  const { userId, cash, expense } = await buildAccountPair();

  await request(app)
    .post('/api/transaction')
    .set('Cookie', global.signin(userId))
    .send({
      entries: [
        {
          amount: 10,
          type: EntryType.Credit,
          accountId: cash.id,
          accountName: cash.name,
          accountType: cash.type,
        },
        {
          amount: 5,
          type: EntryType.Debit,
          accountId: expense.id,
          accountName: expense.name,
          accountType: expense.type,
        },
      ],
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 401 if no entry', async () => {});

it('returns 400 when trying to use others account', async () => {});

it('returns 401 when debit != credit', async () => {});

it('returns 200 with successful transaction', async () => {});
