import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Account } from '../model/account';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@bookkeeping/common';
import { Transaction } from '../model/transaction';

const router = express.Router();

const validators = [
  body('memo').not().isEmpty().withMessage('Please provide transaction memo'),
];

router.put(
  '/api/transaction',
  requireAuth,
  // validators,
  // validateRequest,
  async (req: Request, res: Response) => {
    console.log('update transaction');
    return res.status(StatusCodes.OK).send({ status: 'ok' });
  }
);

export { router as transactionUpdate };
