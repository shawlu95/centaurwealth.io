import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { Point } from '../../model/point';

it('returns 401 when not signed in', async () => {
  await request(app)
    .patch('/api/timeline')
    .send({ date: '2022-01-01' })
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns 404 is data point is not found', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const point = Point.build({
    userId,
    date: new Date('2022-01-01'),
    asset: 0,
    liability: 0,
  });
  await point.save();

  await request(app)
    .patch('/api/timeline')
    .send({ date: '2022-01-02' })
    .set('Cookie', global.signin(userId))
    .expect(StatusCodes.NOT_FOUND);
});

it('returns 200 with successful update', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const point = Point.build({
    userId,
    date: new Date('2022-01-01'),
    asset: 0,
    liability: 0,
  });
  await point.save();

  await request(app)
    .patch('/api/timeline')
    .send({ date: '2022-01-01', asset: 100, liability: 50 })
    .set('Cookie', global.signin(userId))
    .expect(StatusCodes.OK);

  const updated = await Point.findOne({ userId });

  expect(updated!.userId).toEqual(userId);
  expect(updated!.asset).toEqual(100);
  expect(updated!.liability).toEqual(50);
});
