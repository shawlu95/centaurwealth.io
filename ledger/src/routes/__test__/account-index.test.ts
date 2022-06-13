import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { Account, AccountType } from '../../model/account';

it('returns 400 if not signed in', async () => {
  await request(app)
    .get('/api/account')
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns a list of owned account', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const account = Account.build({
    userId,
    name: 'cash',
    type: AccountType.Asset,
  });
  await account.save();

  const {
    body: { accounts },
  } = await request(app)
    .get('/api/account')
    .set('Cookie', global.signin(userId))
    .send()
    .expect(StatusCodes.OK);

  expect(accounts).toBeDefined();
  expect(accounts.length).toEqual(1);
  expect(accounts[0].userId).toEqual(userId);
  expect(accounts[0].type).toEqual('asset');
  expect(accounts[0].name).toEqual('cash');
});
