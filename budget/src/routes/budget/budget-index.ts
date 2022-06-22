import express, { Request, Response } from 'express';
import { Expense } from '../../models/expense';
import { Budget } from '../../models/budget';
import { StatusCodes } from 'http-status-codes';
import { requireAuth } from '@bookkeeping/common';

const router = express.Router();

router.get('/api/budget', requireAuth, async (req: Request, res: Response) => {
  const userId = req.currentUser!.id;
  const budgets = await Budget.find({ userId }).populate({
    path: 'expenses',
    model: Expense,
  });
  return res.status(StatusCodes.OK).send({ budgets });
});

export { router as budgetIndex };
