import mongoose from 'mongoose';
import { Account, AccountType } from '../../../models/account';
import { EntryType } from '@bookkeeping/common';

export const buildAccountPair = async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cash = Account.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    name: 'cash',
    type: AccountType.Asset,
  });
  await cash.save();

  const expense = Account.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    name: 'expense',
    type: AccountType.Asset,
  });
  await expense.save();

  return { userId, cash, expense };
};
