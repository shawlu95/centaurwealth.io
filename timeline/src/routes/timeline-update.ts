import express, { Request, Response } from 'express';
import { Point } from '../model/point';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError, requireAuth } from '@bookkeeping/common';

const router = express.Router();

router.patch(
  '/api/timeline',
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const { asset, liability } = req.body;
    const point = await Point.findOne({
      userId,
      date: new Date(req.body.date),
    });

    if (!point) {
      throw new NotFoundError();
    }

    point.set({ asset, liability });
    await point.save();

    return res.status(StatusCodes.OK).send({ point });
  }
);

export { router as timelineUpdateRouter };
