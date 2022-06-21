import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { natsWrapper } from '../../nats-wrapper';
import { Account, AccountType } from '../../model/account';
import { EntryType } from '@bookkeeping/common';
import { Transaction } from '../../model/transaction';
import { buildAccountPair } from './transaction-test-util';

it('returns 401 when not signed in', async () => {
  await request(app)
    .post('/api/transaction')
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 400 when memo is missing', async () => {
  const { userId, cash, expense } = await buildAccountPair();

  await request(app)
    .post('/api/transaction')
    .set('Cookie', global.signin(userId))
    .send({
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

it('returns 400 if no entry', async () => {
  const { userId, cash, expense } = await buildAccountPair();
  await request(app)
    .post('/api/transaction')
    .set('Cookie', global.signin(userId))
    .send({
      memo: 'food',
      date: '2022-06-12',
      entries: [],
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 400 if no date', async () => {
  const { userId, cash, expense } = await buildAccountPair();

  await request(app)
    .post('/api/transaction')
    .set('Cookie', global.signin(userId))
    .send({
      memo: 'food',
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

it('returns 401 when trying to use others account', async () => {
  const cash = Account.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    name: 'cash',
    type: AccountType.Asset,
  });
  await cash.save();

  const { userId, expense } = await buildAccountPair();

  await request(app)
    .post('/api/transaction')
    .set('Cookie', global.signin(userId))
    .send({
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
    })
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 400 when debit != credit', async () => {
  const { userId, cash, expense } = await buildAccountPair();

  await request(app)
    .post('/api/transaction')
    .set('Cookie', global.signin(userId))
    .send({
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

it('returns 200 with successful transaction', async () => {
  const { userId, cash, expense } = await buildAccountPair();

  const {
    body: { id },
  } = await request(app)
    .post('/api/transaction')
    .set('Cookie', global.signin(userId))
    .send({
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
    })
    .expect(StatusCodes.OK);

  const transaction = await Transaction.findById(id);
  expect(transaction).toBeDefined();
  expect(transaction!.userId).toEqual(userId);
});

it('emits a transaction created event', async () => {
  const { userId, cash, expense } = await buildAccountPair();

  expect(natsWrapper.client.publish).not.toHaveBeenCalled();

  const {
    body: { id },
  } = await request(app)
    .post('/api/transaction')
    .set('Cookie', global.signin(userId))
    .send({
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
    })
    .expect(StatusCodes.OK);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
