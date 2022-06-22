import express, { Request, Response } from 'express';
import { param, query } from 'express-validator';
import { Expense } from '../../models/expense';
import { Budget } from '../../models/budget';
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
  query('limit')
    .not()
    .isEmpty()
    .withMessage('Please provide limit (page size)'),
  query('page').not().isEmpty().withMessage('Please provide page'),
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

    const expenses = await Expense.paginate({
      query: { budgetId },
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
      delete expense._id;
    }

    return res.status(StatusCodes.OK).send({ budget, expenses });
  }
);

export { router as budgetRead };
