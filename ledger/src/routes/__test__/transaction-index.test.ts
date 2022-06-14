import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { EntryType } from '@bookkeeping/common';
import { Account, AccountType } from '../../model/account';
import { Transaction } from '../../model/transaction';

it('returns 400 if not signed in', async () => {
  await request(app)
    .get('/api/transaction')
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns transactions of signed-in user', async () => {
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

  const transaciton = Transaction.build({
    userId,
    memo: 'beer',
    date: new Date(),
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
  });
  await transaciton.save();

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
