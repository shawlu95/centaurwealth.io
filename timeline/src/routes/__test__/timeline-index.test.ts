import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { Point } from '../../model/point';

it('returns 401 when not signed in', async () => {
  await request(app)
    .get('/api/timeline?start=2021-01-01')
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});

it("returns 200 and list of user's data points", async () => {
  const userA = new mongoose.Types.ObjectId().toHexString();
  const pointA = Point.build({
    userId: userA,
    date: new Date('2021-01-01'),
    asset: 0,
    liability: 0,
  });
  await pointA.save();

  const userB = new mongoose.Types.ObjectId().toHexString();
  const pointB = Point.build({
    userId: userB,
    date: new Date('2022-01-01'),
    asset: 0,
    liability: 0,
  });
  await pointB.save();

  const {
    body: { points },
  } = await request(app)
    .get('/api/timeline?start=2021-01-01')
    .set('Cookie', global.signin(userA))
    .expect(StatusCodes.OK);

  expect(points.length).toEqual(1);
  expect(points[0].userId).toEqual(userA);
  expect(new Date(points[0].date)).toEqual(new Date('2021-01-01'));
});

it('Only returns data points later than start date', async () => {
  const user = new mongoose.Types.ObjectId().toHexString();
  const point = Point.build({
    userId: user,
    date: new Date('2021-01-01'),
    asset: 0,
    liability: 0,
  });
  await point.save();

  const {
    body: { points },
  } = await request(app)
    .get('/api/timeline?start=2021-01-02')
    .set('Cookie', global.signin(user))
    .expect(StatusCodes.OK);

  expect(points.length).toEqual(0);
});
