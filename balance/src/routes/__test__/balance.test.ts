import request from 'supertest';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { buildAccountPair } from '../../events/listeners/__test__/transaction-test-util';

it('returns 401 when not signed in', async () => {
  await request(app)
    .get('/api/balance/foo')
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 200 and list of accounts', async () => {
  const { userId, cash } = await buildAccountPair();

  const {
    body: { account },
  } = await request(app)
    .get('/api/balance/' + cash.id)
    .set('Cookie', global.signin(userId))
    .send()
    .expect(StatusCodes.OK);

  expect(account.userId).toEqual(userId);
  expect(account.name).toEqual(cash.name);
});

it('returns 401 if account belong to others', async () => {
  const { cash } = await buildAccountPair();

  await request(app)
    .get('/api/balance/' + cash.id)
    .set('Cookie', global.signin())
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});
