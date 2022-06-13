import { body } from 'express-validator';
import express, { Request, Response } from 'express';
import { Account } from '../model/account';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@bookkeeping/common';

const router = express.Router();

const validators = [
  body('name').not().isEmpty().withMessage('Please provide account name'),
];

router.patch(
  '/api/account',
  requireAuth,
  validators,
  validateRequest,
  async (req: Request, res: Response) => {
    const { id, name } = req.body;
    const userId = req.currentUser!.id;

    const account = await Account.findById(id);
    if (!account) {
      throw new NotFoundError();
    }

    const colliding = await Account.findOne({ userId, name });
    if (colliding) {
      throw new BadRequestError('Collide with existing account');
    }

    if (account.userId != req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    account.set({ name });
    await account.save();

    return res.status(StatusCodes.OK).send({ id: account.id });
  }
);

export { router as accountUpdate };
