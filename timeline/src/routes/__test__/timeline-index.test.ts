import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { Point } from '../../model/point';

it('returns 401 when not signed in', async () => {
  await request(app)
    .get('/api/timeline')
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 200 and list of data points', async () => {
  const userA = new mongoose.Types.ObjectId().toHexString();
  const pointA = Point.build({ userId: userA, date: new Date('2021-01-01') });
  await pointA.save();

  const userB = new mongoose.Types.ObjectId().toHexString();
  const pointB = Point.build({ userId: userB, date: new Date('2022-01-01') });
  await pointB.save();

  const {
    body: { points },
  } = await request(app)
    .get('/api/timeline')
    .set('Cookie', global.signin(userA))
    .send()
    .expect(StatusCodes.OK);

  expect(points.length).toEqual(1);
  expect(points[0].userId).toEqual(userA);
  expect(new Date(points[0].date)).toEqual(new Date('2021-01-01'));
});
