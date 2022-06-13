import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Account, AccountType } from '../model/account';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  requireAuth,
  validateRequest,
} from '@bookkeeping/common';

const router = express.Router();

const validators = [
  body('name').not().isEmpty().withMessage('Please provide account name'),
  body('type').not().isEmpty().withMessage('Please provide account type'),
  body('type').custom((type: string) =>
    Object.values(AccountType).includes(type as AccountType)
  ),
];

router.post(
  '/api/account',
  requireAuth,
  validators,
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, type } = req.body;
    const userId = req.currentUser!.id;
    const exist = await Account.findOne({ name, userId });
    if (exist) {
      throw new BadRequestError('Account already exists');
    }

    const account = Account.build({
      name,
      userId,
      type: type as AccountType,
    });
    await account.save();
    return res.status(StatusCodes.OK).send({ id: account.id });
  }
);

export { router as accountCreate };
