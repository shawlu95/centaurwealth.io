import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { natsWrapper } from '../../nats-wrapper';
import { EntryType } from '@bookkeeping/common';
import { Account, AccountType } from '../../model/account';
import { Transaction } from '../../model/transaction';
import { buildTransaction } from './transaction-test-util';

it('returns 400 if not signed in', async () => {
  await request(app)
    .put('/api/transaction')
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 401 if missing id', async () => {
  const { userId, cash, expense, transaction } = await buildTransaction();
  await request(app)
    .put('/api/transaction')
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
          amount: 10,
          type: EntryType.Debit,
          accountId: expense.id,
          accountName: expense.name,
          accountType: expense.type,
        },
      ],
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 401 if missing memo', async () => {
  const { userId, cash, expense, transaction } = await buildTransaction();
  await request(app)
    .put('/api/transaction')
    .set('Cookie', global.signin(userId))
    .send({
      id: transaction.id,
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
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 401 if no entry', async () => {
  const { userId, cash, expense, transaction } = await buildTransaction();
  await request(app)
    .put('/api/transaction')
    .set('Cookie', global.signin(userId))
    .send({
      id: transaction.id,
      memo: 'food',
      entries: [],
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 400 when trying to use others transaction', async () => {
  const { userId, cash, expense, transaction } = await buildTransaction();
  await request(app)
    .put('/api/transaction')
    .set('Cookie', global.signin())
    .send({
      id: transaction.id,
      memo: 'beer',
      entries: [
        {
          amount: 5,
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
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 400 when trying to use others account', async () => {
  const { userId, cash, expense, transaction } = await buildTransaction();

  const newCash = Account.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    name: 'cash',
    type: AccountType.Asset,
  });
  await newCash.save();

  await request(app)
    .put('/api/transaction')
    .set('Cookie', global.signin(userId))
    .send({
      id: transaction.id,
      memo: 'beer',
      entries: [
        {
          amount: 10,
          type: EntryType.Credit,
          accountId: newCash.id,
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

it('returns 401 when debit != credit', async () => {
  const { userId, cash, expense, transaction } = await buildTransaction();

  await request(app)
    .put('/api/transaction')
    .set('Cookie', global.signin(userId))
    .send({
      id: transaction.id,
      memo: 'beer',
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
  const { userId, cash, expense, transaction } = await buildTransaction();

  await request(app)
    .put('/api/transaction')
    .set('Cookie', global.signin(userId))
    .send({
      id: transaction.id,
      memo: 'food',
      entries: [
        {
          amount: 5,
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
    .expect(StatusCodes.OK);

  const updated = await Transaction.findById(transaction.id);
  expect(updated).toBeDefined();
  expect(updated!.userId).toEqual(userId);
  expect(updated!.memo).toEqual('food');
  expect(updated!.entries[0].amount).toEqual(5);
});

it('emits a transaction created event', async () => {
  const { userId, cash, expense, transaction } = await buildTransaction();

  expect(natsWrapper.client.publish).not.toHaveBeenCalled();

  await request(app)
    .put('/api/transaction')
    .set('Cookie', global.signin(userId))
    .send({
      id: transaction.id,
      memo: 'food',
      date: new Date(),
      entries: [
        {
          amount: 5,
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
    .expect(StatusCodes.OK);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
