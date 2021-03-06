import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { app } from '../../app';

it('clears cookie after signing out', async () => {
  await request(app)
    .post('/api/auth/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(StatusCodes.CREATED);

  const res = await request(app)
    .post('/api/auth/signout')
    .send({})
    .expect(StatusCodes.OK);
  expect(res.get('Set-Cookie')[0]).toEqual(
    'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
  );
});
