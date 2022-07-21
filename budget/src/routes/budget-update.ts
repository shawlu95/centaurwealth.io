import express, { Request, Response } from 'express';
import { param, body } from 'express-validator';
import { Budget } from '../models/budget';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  validateRequest,
} from '@bookkeeping/common';

const router = express.Router();

const validators = [
  param('id').not().isEmpty().withMessage('Please provide budget id'),
  param('id').isMongoId().withMessage('Please provide valid budget id'),
  body('name').not().isEmpty().withMessage('Please provide budget name'),
  body('monthly').isNumeric().withMessage('Budget must be a number'),
  body('monthly').isNumeric().withMessage('Budget must be a number'),
];

router.patch(
  '/api/budget/:id',
  validators,
  validateRequest,
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;
    const { name, monthly } = req.body;

    if (parseFloat(monthly) <= 0) {
      throw new BadRequestError('Budget must be positive');
    }

    const budget = await Budget.findById(id);

    if (!budget) {
      throw new NotFoundError();
    }

    if (budget.userId != userId) {
      throw new NotAuthorizedError();
    }

    // allow changing immutable budget amount, but not name
    if (!budget.mutable && name && budget.name !== name) {
      throw new BadRequestError(`Buget name is immutable: ${budget.name}`);
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
