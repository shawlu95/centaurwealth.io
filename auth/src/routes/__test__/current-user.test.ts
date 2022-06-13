import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  const cookie = await global.signin();

  // cookie is not managed automatically by the follow up request
  // need to attach cookie manually
  const res = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(StatusCodes.OK);
  expect(res.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  const res = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(StatusCodes.OK);
  expect(res.body.currentUser).toBeNull();
});
