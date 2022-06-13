import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { natsWrapper } from '../../nats-wrapper';
import { Account, AccountType } from '../../model/account';
import { EntryType } from '@bookkeeping/common';
import { Transaction } from '../../model/transaction';

it('returns 400 when not signed in', async () => {
  await request(app)
    .post('/api/transaction')
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 401 when memo is missing', async () => {
  await request(app)
    .post('/api/transaction')
    .set('Cookie', global.signin())
    .send({ userId: 'foo', memo: '' })
    .expect(StatusCodes.BAD_REQUEST);

  await request(app)
    .post('/api/transaction')
    .set('Cookie', global.signin())
    .send({ userId: 'foo' })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 400 when trying to use others account', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const cash = Account.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    name: 'cash',
    type: AccountType.Asset,
  });
  await cash.save();

  const expense = Account.build({
    userId,
    name: 'expense',
    type: AccountType.Asset,
  });
  await expense.save();

  await request(app)
    .post('/api/transaction')
    .set('Cookie', global.signin(userId))
    .send({
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
  const userId = new mongoose.Types.ObjectId().toHexString();

  const cash = Account.build({
    userId,
    name: 'cash',
    type: AccountType.Asset,
  });
  await cash.save();

  const expense = Account.build({
    userId,
    name: 'expense',
    type: AccountType.Asset,
  });
  await expense.save();

  await request(app)
    .post('/api/transaction')
    .set('Cookie', global.signin(userId))
    .send({
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
  const userId = new mongoose.Types.ObjectId().toHexString();

  const cash = Account.build({
    userId,
    name: 'cash',
    type: AccountType.Asset,
  });
  await cash.save();

  const expense = Account.build({
    userId,
    name: 'expense',
    type: AccountType.Asset,
  });
  await expense.save();

  const {
    body: { id },
  } = await request(app)
    .post('/api/transaction')
    .set('Cookie', global.signin(userId))
    .send({
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
