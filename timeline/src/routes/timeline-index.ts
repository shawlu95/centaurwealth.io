import express, { Request, Response } from 'express';
import { Point } from '../model/point';
import { StatusCodes } from 'http-status-codes';
import { requireAuth } from '@bookkeeping/common';

const router = express.Router();

router.get(
  '/api/timeline',
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const yearFirstDay = new Date(new Date().getFullYear(), 0, 1);
    const start = req.query.start || yearFirstDay;
    const query = { userId, date: { $gte: start } };
    const points = await Point.find(query).sort('date');
    return res.status(StatusCodes.OK).send({ points });
  }
);

export { router as timelineRouter };
