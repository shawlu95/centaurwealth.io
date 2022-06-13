import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { app } from '../../app';

it('fails when email does not exists', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it('fails when incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(StatusCodes.CREATED);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password2',
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it('responds with a cookie when given valid credential', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(StatusCodes.CREATED);

  const res = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(StatusCodes.OK);
  expect(res.get('Set-Cookie')).toBeDefined();
});
