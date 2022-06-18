import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { User } from '../../model/user';

const data = {
  id: new mongoose.Types.ObjectId().toHexString(),
  email: 'test@test.com',
  password: 'password',
};

it('returns 400 when not signed in', async () => {
  await request(app)
    .post('/api/users/update')
    .send(data)
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 401 when using same email', async () => {
  const user = User.build(data);
  await user.save();
  await request(app)
    .post('/api/users/update')
    .set('Cookie', global.signin(data.id))
    .send(data)
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 401 when using wrong password', async () => {
  const user = User.build(data);
  await user.save();
  await request(app)
    .post('/api/users/update')
    .set('Cookie', global.signin(data.id))
    .send({
      email: 'test2@test.com',
      password: 'wrong',
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 401 when updating to existing email', async () => {
  const user = User.build(data);
  await user.save();

  const another = User.build({
    email: 'someone@test.com',
    password: 'bar',
  });
  await another.save();

  await request(app)
    .post('/api/users/update')
    .set('Cookie', global.signin(data.id))
    .send(another)
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns 200 if successful', async () => {
  const user = User.build(data);
  await user.save();
  await request(app)
    .post('/api/users/update')
    .set('Cookie', global.signin(data.id))
    .send({
      email: 'test2@test.com',
      password: 'password',
    })
    .expect(StatusCodes.OK);

  const updated = await User.findById(user.id);
  expect(updated!.email).toEqual('test2@test.com');
});
