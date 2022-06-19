import express, { Request, Response } from 'express';
import { query } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@bookkeeping/common';
import { Transaction } from '../model/transaction';

const router = express.Router();

const validators = [
  query('limit').not().isEmpty().withMessage('Please provide page size'),
  query('page').not().isEmpty().withMessage('Please provide page'),
];

router.get(
  '/api/transaction',
  requireAuth,
  validators,
  validateRequest,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const transactions = await Transaction.paginate({
      query: { userId },
      sort: { date: -1 },
      page: parseInt(req.query.page as string, 10),
      limit: parseInt(req.query.limit as string, 10),
    });
    return res.status(StatusCodes.OK).send({ transactions });
  }
);

router.get(
  '/api/transaction/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      throw new NotFoundError();
    }

    if (transaction.userId !== userId) {
      throw new NotAuthorizedError();
    }

    return res.status(StatusCodes.OK).send({ transaction });
  }
);

export { router as transactionRead };
