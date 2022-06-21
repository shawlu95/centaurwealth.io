import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { natsWrapper } from '../../nats-wrapper';
import { Account, AccountType } from '../../model/account';

it('returns 401 when not signed in', async () => {
  await request(app)
    .post('/api/account')
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 400 with missing account name', async () => {
  await request(app)
    .post('/api/account')
    .set('Cookie', global.signin())
    .send({ type: 'Asset' })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 400 with missing account type', async () => {
  await request(app)
    .post('/api/account')
    .set('Cookie', global.signin())
    .send({ name: 'Cash' })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 400 with bad account name', async () => {
  await request(app)
    .post('/api/account')
    .set('Cookie', global.signin())
    .send({ name: '', type: 'liability' })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 400 with bad account type', async () => {
  await request(app)
    .post('/api/account')
    .set('Cookie', global.signin())
    .send({ name: 'foo', type: 'bar' })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 401 with duplicate account', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const account = Account.build({
    userId,
    name: 'cash',
    type: AccountType.Asset,
  });
  await account.save();

  await request(app)
    .post('/api/account')
    .set('Cookie', global.signin(userId))
    .send({
      name: 'cash',
      type: 'asset',
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 200 with successful account creation', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const {
    body: { id },
  } = await request(app)
    .post('/api/account')
    .set('Cookie', global.signin(userId))
    .send({
      name: 'cash',
      type: 'asset',
    })
    .expect(StatusCodes.OK);

  const account = await Account.findById(id);
  expect(account).toBeDefined();
  expect(account!.userId).toEqual(userId);
  expect(account!.close).toBeUndefined();
});

it('returns 200 with successful account creation (temporary)', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const {
    body: { id },
  } = await request(app)
    .post('/api/account')
    .set('Cookie', global.signin(userId))
    .send({
      name: 'expense',
      type: 'temporary',
    })
    .expect(StatusCodes.OK);

  const account = await Account.findById(id);
  expect(account).toBeDefined();
  expect(account!.userId).toEqual(userId);
  expect(account!.close).toEqual(new Date('1970-01-01'));
});

it('emits an account creation event', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  expect(natsWrapper.client.publish).not.toHaveBeenCalled();

  const {
    body: { id },
  } = await request(app)
    .post('/api/account')
    .set('Cookie', global.signin(userId))
    .send({
      name: 'cash',
      type: 'asset',
    })
    .expect(StatusCodes.OK);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
