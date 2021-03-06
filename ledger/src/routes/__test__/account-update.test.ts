import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { natsWrapper } from '../../nats-wrapper';
import { Account, AccountType } from '../../model/account';
import { buildTransaction } from './test-utils';
import { Transaction } from '../../model/transaction';

it('returns 401 when not signed in', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .patch(`/api/account/${id}`)
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('rejects with 400 when name is missing', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .patch(`/api/account/${id}`)
    .set('Cookie', global.signin())
    .send({ type: 'cash' })
    .expect(StatusCodes.BAD_REQUEST);
});

it('rejects with 400 when name is invalid', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .patch(`/api/account/${id}`)
    .set('Cookie', global.signin())
    .send({ name: '', type: 'cash' })
    .expect(StatusCodes.BAD_REQUEST);
});

it('rejects with 404 when account is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .patch(`/api/account/${id}`)
    .set('Cookie', global.signin())
    .send({
      name: 'cash',
    })
    .expect(StatusCodes.NOT_FOUND);
});

it('rejects with 400 when colliding with existing account', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  // user creates an asset account
  const account1 = Account.build({
    userId,
    name: 'cash',
    type: AccountType.Asset,
  });
  await account1.save();

  // user creates another asset account
  const account2 = Account.build({
    userId,
    name: 'stock',
    type: AccountType.Asset,
  });
  await account2.save();

  // user tries to rename to an existing asset account
  await request(app)
    .patch(`/api/account/${account2.id}`)
    .set('Cookie', global.signin(userId))
    .send({ name: 'cash' })
    .expect(StatusCodes.BAD_REQUEST);
});

it('rejects with 200 when account is unchanged', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const account = Account.build({
    userId,
    name: 'cash',
    type: AccountType.Asset,
  });
  await account.save();

  await request(app)
    .patch(`/api/account/${account.id}`)
    .set('Cookie', global.signin(userId))
    .send({ name: account.name })
    .expect(StatusCodes.OK);
});

it('rejects with 401 when account owner is different', async () => {
  const account = Account.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    name: 'cash',
    type: AccountType.Asset,
  });
  await account.save();

  await request(app)
    .patch(`/api/account/${account.id}`)
    .set('Cookie', global.signin())
    .send({ name: 'equipment' })
    .expect(StatusCodes.UNAUTHORIZED);
});

it('rejects with 400 when trying to update immutable account', async () => {
  const account = Account.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    name: 'Expense',
    type: AccountType.Asset,
    mutable: false,
  });
  await account.save();

  await request(app)
    .patch(`/api/account/${account.id}`)
    .set('Cookie', global.signin(account.userId))
    .send({ name: 'equipment' })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 200 with successful update', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const account = Account.build({
    userId,
    name: 'cash',
    type: AccountType.Asset,
  });
  await account.save();

  await request(app)
    .patch(`/api/account/${account.id}`)
    .set('Cookie', global.signin(userId))
    .send({ name: 'equipment' })
    .expect(StatusCodes.OK);

  const updated = await Account.findById(account.id);
  expect(updated?.userId).toEqual(userId);
  expect(updated?.name).toEqual('equipment');
});

it('returns 200 and updates all transactions of related to the account', async () => {
  const { userId, cash, expense, transaction } = await buildTransaction();

  await request(app)
    .patch(`/api/account/${expense.id}`)
    .set('Cookie', global.signin(userId))
    .send({ name: 'equipment' })
    .expect(StatusCodes.OK);

  const equipment = await Account.findById(expense.id);
  expect(equipment!.userId).toEqual(userId);
  expect(equipment!.name).toEqual('equipment');

  const updated = await Transaction.findById(transaction.id);
  const entry = updated!.entries.filter(
    (entry) => entry.accountId === equipment!.id
  )[0];
  expect(entry.accountName).toEqual('equipment');
});

it('emits an account update event', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const account = Account.build({
    userId,
    name: 'cash',
    type: AccountType.Asset,
  });
  await account.save();

  expect(natsWrapper.client.publish).not.toHaveBeenCalled();

  await request(app)
    .patch(`/api/account/${account.id}`)
    .set('Cookie', global.signin(userId))
    .send({ name: 'equipment' })
    .expect(StatusCodes.OK);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
