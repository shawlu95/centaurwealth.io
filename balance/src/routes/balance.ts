import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import { Account } from '../models/account';
import { StatusCodes } from 'http-status-codes';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@bookkeeping/common';

const router = express.Router();

const validators = [
  param('id').not().isEmpty().withMessage('Please provide account id'),
  param('id').isMongoId().withMessage('Please provide valid account id'),
];

router.get(
  '/api/balance/:id',
  requireAuth,
  validators,
  validateRequest,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const { id } = req.params;
    const account = await Account.findById(id);

    if (!account) {
      throw new NotFoundError();
    }

    if (account.userId !== userId) {
      throw new NotAuthorizedError();
    }

    return res.status(StatusCodes.OK).send({ account });
  }
);

export { router as balance };
