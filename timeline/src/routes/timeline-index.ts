import express, { Request, Response } from 'express';
import { Point } from '../model/point';
import { StatusCodes } from 'http-status-codes';
import { requireAuth } from '@bookkeeping/common';

const router = express.Router();

router.get(
  '/api/timeline',
  requireAuth,
  async (req: Request, res: Response) => {
    const points = await Point.find({ userId: req.currentUser!.id });
    return res.status(StatusCodes.OK).send({ points });
  }
);

export { router as timelineRouter };
