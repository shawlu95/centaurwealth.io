import express, { Request, Response } from 'express';
import { param, body } from 'express-validator';
import { Budget } from '../models/budget';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
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
    const { name, monthly } = req.body;

    const budget = await Budget.findById(id);

    if (!budget) {
      throw new NotFoundError();
    }

    if (budget.userId != userId) {
      throw new NotAuthorizedError();
    }

    if (!budget.mutable) {
      throw new BadRequestError('Buget is immutable');
    }

    const exist = await Budget.findOne({ userId, name });
    if (exist && exist.id !== id) {
      throw new BadRequestError(`Budget already exists with name: ${name}`);
    }

    budget.set({
      name: name || budget.name,
      monthly: monthly || budget.monthly,
    });
    await budget.save();

    return res.status(StatusCodes.OK).send({ budget });
  }
);

export { router as budgetUpdate };
