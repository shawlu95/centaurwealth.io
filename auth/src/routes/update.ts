import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { User } from '../model/user';
import { Password } from '../services/password';
import {
  currentUser,
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
} from '@bookkeeping/common';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

const validators = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Length must be 4~20'),
];

router.post(
  '/api/auth/update',
  currentUser,
  requireAuth,
  validators,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findById(req.currentUser!.id);

    if (!user) {
      throw new NotFoundError();
    }

    const match = await Password.compare(user.password, password);
    if (!match) {
      throw new BadRequestError('Invalid credential');
    }

    const collision = await User.findOne({ email });
    if (collision) {
      throw new BadRequestError('Email in use');
    }

    user.set({ email });
    await user.save();

    // require re-login
    req.session = null;
    return res.status(StatusCodes.OK).send();
  }
);

export { router as updateRouter };
