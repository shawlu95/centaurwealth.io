import express, { Request, Response } from 'express';
import { query } from 'express-validator';
import { Expense } from '../models/expense';
import { Budget } from '../models/budget';
import { StatusCodes } from 'http-status-codes';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
} from '@bookkeeping/common';

const router = express.Router();

const validators = [
  query('limit')
    .not()
    .isEmpty()
    .withMessage('Please provide limit (page size)'),
  query('page').not().isEmpty().withMessage('Please provide page'),
];

router.get(
  '/api/budget',
  requireAuth,
  validators,
  validateRequest,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const budgets = await Budget.find({ userId });

    const expenses = await Expense.paginate({
      query: { userId },
      sort: { date: -1 },
      page: parseInt(req.query.page as string, 10),
      limit: parseInt(req.query.limit as string, 10),
    });

    if (!expenses) {
      throw new NotFoundError();
    }

    for (var i in expenses.docs) {
      const expense = expenses.docs[i];
      expense.id = expense._id;
      expense.budget = budgets.filter((e) => e.id == expense.budgetId)[0];
      delete expense._id;
    }

    return res.status(StatusCodes.OK).send({ budgets, expenses });
  }
);

export { router as budgetIndex };
