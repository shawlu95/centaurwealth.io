import mongoose from 'mongoose';
import { Account, AccountType } from '../../model/account';
import { EntryType } from '@bookkeeping/common';
import { Transaction } from '../../model/transaction';

export const buildAccountPair = async () => {
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

  return { userId, cash, expense };
};

export const buildTransaction = async () => {
  const { userId, cash, expense } = await buildAccountPair();
  const transaction = Transaction.build({
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
  await transaction.save();
  return { userId, cash, expense, transaction };
};
