import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { natsWrapper } from '../../nats-wrapper';
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
