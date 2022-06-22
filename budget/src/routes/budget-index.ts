import express, { Request, Response } from 'express';
import { query } from 'express-validator';
import { Expense, ExpenseSummary } from '../models/expense';
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

const getMonthStart = (date = new Date()): Date => {
  return new Date(date.setDate(1));
};

const getQuarterStart = (date = new Date()): Date => {
  const quarter = Math.floor(date.getMonth() / 3 + 1);
  return new Date(date.setFullYear(date.getFullYear(), (quarter - 1) * 3, 1));
};

const getSemiannualStart = (date = new Date()): Date => {
  const month = date.getMonth() <= 5 ? 0 : 6;
  return new Date(date.setFullYear(date.getFullYear(), month, 1));
};

const getYearStart = (date = new Date()): Date => {
  return new Date(date.setFullYear(date.getFullYear(), 0, 1));
};

const getSummary = async (userId: string, gte: Date) => {
  // @ts-ignore
  const summary = await Expense.summary(userId, gte);
  await Budget.populate(summary, { path: 'budgetId' });
  console.log('summary', summary);
  return new Map(
    summary.map((budget: ExpenseSummary) => {
      return [budget.budgetId.id, budget];
    })
  );
};

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

    const summary = {
      monthly: await getSummary(userId, getMonthStart()),
      quarterly: await getSummary(userId, getQuarterStart()),
      semiannual: await getSummary(userId, getSemiannualStart()),
      annual: await getSummary(userId, getYearStart()),
    };
    return res.status(StatusCodes.OK).send({ budgets, expenses, summary });
  }
);

export { router as budgetIndex };
