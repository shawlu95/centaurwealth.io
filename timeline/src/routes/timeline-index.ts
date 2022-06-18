import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Point } from '../model/point';
import { StatusCodes } from 'http-status-codes';
import { requireAuth, validateRequest } from '@bookkeeping/common';

const router = express.Router();

const validators = [
  body('start')
    .not()
    .isEmpty()
    .withMessage('Please provide timeline start date'),
];
router.get(
  '/api/timeline',
  requireAuth,
  validators,
  validateRequest,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const { start } = req.body;
    const query = { userId, date: { $gte: start } };
    const points = await Point.find(query).sort('date');
    return res.status(StatusCodes.OK).send({ points });
  }
);

export { router as timelineRouter };
