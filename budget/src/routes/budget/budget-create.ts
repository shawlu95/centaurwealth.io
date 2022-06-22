import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Budget } from '../../models/budget';
import { StatusCodes } from 'http-status-codes';
import { requireAuth, validateRequest } from '@bookkeeping/common';

const router = express.Router();

const validators = [
  body('name').not().isEmpty().withMessage('Please provide budget name'),
  body('monthly').not().isEmpty().withMessage('Please provide monthly budget'),
  body('quarterly')
    .not()
    .isEmpty()
    .withMessage('Please provide quarterly budget'),
  body('semiannual')
    .not()
    .isEmpty()
    .withMessage('Please provide semiannual budget'),
  body('annual').not().isEmpty().withMessage('Please provide annual budget'),
];

router.post(
  '/api/budget',
  requireAuth,
  validators,
  validateRequest,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const budget = Budget.build({
      ...req.body,
      userId,
    });
    await budget.save();
    return res.status(StatusCodes.CREATED).send({ userId });
  }
);

export { router as budegetCreate };
