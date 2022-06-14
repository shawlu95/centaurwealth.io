import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { natsWrapper } from '../../nats-wrapper';
import { Account, AccountType } from '../../model/account';

it('returns 400 when not signed in', async () => {
  await request(app)
    .patch('/api/account')
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('rejects with 401 when name is missing', async () => {
  await request(app)
    .patch('/api/account')
    .set('Cookie', global.signin())
    .send({ type: 'cash' })
    .expect(StatusCodes.BAD_REQUEST);
});

it('rejects with 401 when name is invalid', async () => {
  await request(app)
    .patch('/api/account')
    .set('Cookie', global.signin())
    .send({ name: '', type: 'cash' })
    .expect(StatusCodes.BAD_REQUEST);
});

it('rejects with 404 when account is not found', async () => {
  await request(app)
    .patch('/api/account')
    .set('Cookie', global.signin())
    .send({
      id: new mongoose.Types.ObjectId().toHexString(),
      name: 'cash',
    })
    .expect(StatusCodes.NOT_FOUND);
});

it('rejects with 401 when colliding with existing account', async () => {
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
    .patch('/api/account')
    .set('Cookie', global.signin(userId))
    .send({ id: account2.id, name: 'cash' })
    .expect(StatusCodes.BAD_REQUEST);
});

it('rejects with 400 when account owner is different', async () => {
  const account = Account.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    name: 'cash',
    type: AccountType.Asset,
  });
  await account.save();

  await request(app)
    .patch('/api/account')
    .set('Cookie', global.signin())
    .send({ id: account.id, name: 'equipment' })
    .expect(StatusCodes.UNAUTHORIZED);
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
    .patch('/api/account')
    .set('Cookie', global.signin(userId))
    .send({ id: account.id, name: 'equipment' })
    .expect(StatusCodes.OK);

  const updated = await Account.findById(account.id);
  expect(updated?.userId).toEqual(userId);
  expect(updated?.name).toEqual('equipment');
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
    .patch('/api/account')
    .set('Cookie', global.signin(userId))
    .send({ id: account.id, name: 'equipment' })
    .expect(StatusCodes.OK);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
