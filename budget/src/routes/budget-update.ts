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
];

router.patch(
  '/api/budget/:id',
  requireAuth,
  validators,
  validateRequest,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const { id } = req.params;

    const budget = await Budget.findById(id);

    if (!budget) {
      throw new NotFoundError();
    }

    if (budget.userId != userId) {
      throw new NotAuthorizedError();
    }

    budget.set({
      name: req.body.name || budget.name,
      monthly: req.body.monthly || budget.monthly,
      quarterly: req.body.quarterly || budget.quarterly,
      semiannual: req.body.semiannual || budget.semiannual,
      annual: req.body.annual || budget.annual,
    });
    await budget.save();

    return res.status(StatusCodes.OK).send({ budget });
  }
);

export { router as budgetUpdate };
