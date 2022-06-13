import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(StatusCodes.CREATED);
});

it('returns a 400 with invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'testtest.com',
      password: 'password',
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns a 400 with short password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'p',
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
    })
    .expect(StatusCodes.BAD_REQUEST);

  return await request(app)
    .post('/api/users/signup')
    .send({
      password: 'password',
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(StatusCodes.CREATED);

  return await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it('sets a cookie after successful signup', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(StatusCodes.CREATED);

  // cookie is only set on https connection
  expect(res.get('Set-Cookie')).toBeDefined();
});
