import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Expense } from '../models/expense';
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
  body('budgetId').not().isEmpty().withMessage('Please provide budget id'),
  body('expenseId').not().isEmpty().withMessage('Please provide expense id'),
  body('budgetId').isMongoId().withMessage('Please provide valid budget id'),
  body('expenseId').isMongoId().withMessage('Please provide valid expense id'),
];

router.post(
  '/api/budget/classify',
  requireAuth,
  validators,
  validateRequest,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const { budgetId, expenseId } = req.body;
    const budget = await Budget.findById(budgetId);
    const expense = await Expense.findById(expenseId);

    if (!budget || !expense) {
      throw new NotFoundError();
    }

    if (budget.userId != userId || expense.userId != userId) {
      throw new NotAuthorizedError();
    }

    expense.set({ budgetId });
    await expense.save();

    return res.status(StatusCodes.OK).send({ expense });
  }
);

export { router as budgetClassify };
