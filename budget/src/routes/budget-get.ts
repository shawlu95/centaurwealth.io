import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import { Budget } from '../models/budget';
import { StatusCodes } from 'http-status-codes';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@bookkeeping/common';

const router = express.Router();

const validators = [
  param('id').not().isEmpty().withMessage('Please provide budget id'),
  param('id').isMongoId().withMessage('Please provide valid budget id'),
];

router.get(
  '/api/budget/:id',
  requireAuth,
  validators,
  validateRequest,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const { id: budgetId } = req.params;
    const budget = await Budget.findById(budgetId);

    if (!budget) {
      throw new NotFoundError();
    }

    if (budget.userId != userId) {
      throw new NotAuthorizedError();
    }

    return res.status(StatusCodes.OK).send({ budget });
  }
);

export { router as budgetGet };
