import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Budget } from '../models/budget';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  requireAuth,
  validateRequest,
} from '@bookkeeping/common';

const router = express.Router();

const validators = [
  body('name').not().isEmpty().withMessage('Please provide budget name'),
  body('monthly').not().isEmpty().withMessage('Please provide monthly budget'),
];

router.post(
  '/api/budget',
  requireAuth,
  validators,
  validateRequest,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const { name, monthly } = req.body;

    const exist = await Budget.findOne({ userId, name });
    if (exist) {
      throw new BadRequestError(`Budget already exists: ${name}`);
    }

    const budget = Budget.build({
      userId,
      name,
      monthly,
    });
    await budget.save();
    return res.status(StatusCodes.CREATED).send({ budget });
  }
);

export { router as budegetCreate };
