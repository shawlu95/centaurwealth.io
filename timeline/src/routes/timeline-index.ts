import express, { Request, Response } from 'express';
import { Point } from '../model/point';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

router.get('/api/timeline', async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const yearFirstDay = new Date(new Date().getFullYear(), 0, 1);
  const start = req.query.start || yearFirstDay;
  const query = { userId, date: { $gte: start } };
  const points = await Point.find(query).sort('date');
  return res.status(StatusCodes.OK).send({ points });
});

export { router as timelineRouter };
