import express, { Request, Response } from 'express';
import { query } from 'express-validator';
import { Expense, ExpenseSummary } from '../models/expense';
import { Budget } from '../models/budget';
import { StatusCodes } from 'http-status-codes';
import dateUtils from './date-util';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
} from '@bookkeeping/common';

const router = express.Router();

const validators = [
  query('limit')
    .not()
    .isEmpty()
    .withMessage('Please provide limit (page size)'),
  query('page').not().isEmpty().withMessage('Please provide page'),
];

const summarize = async (
  userId: string,
  gte: Date,
  lt: Date
): Promise<Map<string, ExpenseSummary>> => {
  // @ts-ignore
  const summary = await Expense.summary(userId, gte, lt);
  return new Map(
    summary.map((budget: ExpenseSummary) => {
      return [budget.budgetId.toString(), budget];
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
    const budgets = await Budget.find({ userId }).sort({ monthly: -1 });
    const budgetId = req.query.budgetId;

    var query;
    if (budgetId !== undefined) {
      const budget = await Budget.findById(budgetId);

      if (!budget) {
        throw new NotFoundError();
      }

      if (budget.userId !== userId) {
        throw new NotAuthorizedError();
      }

      query = { userId, budgetId };
    } else {
      query = { userId };
    }

    const expenses = await Expense.paginate({
      query,
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

    // calculate expense summary for different aggregate period
    const monthly = await summarize(
      userId,
      dateUtils.monthStart(),
      dateUtils.nextMonth()
    );
    const quarterly = await summarize(
      userId,
      dateUtils.quarterStart(),
      dateUtils.nextQuarter()
    );
    const annual = await summarize(
      userId,
      dateUtils.yearStart(),
      dateUtils.nextYear()
    );

    // zip aggregation results into budget object
    const merged = [];
    for (var i in budgets) {
      const budget = budgets[i];
      merged.push({
        id: budget.id,
        userId: budget.userId,
        name: budget.name,
        monthly: budget.monthly,
        quarterly: budget.quarterly,
        annual: budget.annual,
        summary: {
          monthly: monthly.get(budget.id),
          quarterly: quarterly.get(budget.id),
          annual: annual.get(budget.id),
        },
      });
    }
    return res.status(StatusCodes.OK).send({ budgets: merged, expenses });
  }
);

export { router as budgetIndex };
