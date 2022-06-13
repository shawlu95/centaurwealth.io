import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { app } from '../../app';

it('clears cookie after signing out', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(StatusCodes.CREATED);

  const res = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(StatusCodes.OK);
  expect(res.get('Set-Cookie')[0]).toEqual(
    'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
