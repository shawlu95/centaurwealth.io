import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '@bookkeeping/common';
import { StatusCodes } from 'http-status-codes';
import passport from 'passport';

const router = express.Router();

const validators = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('Please enter a password'),
];

router.post(
  '/api/auth/signin',
  validators,
  validateRequest,
  passport.authenticate('local'),
  (req: Request, res: Response) => {
    return res.status(StatusCodes.OK).json(req.user);
  }
);

export { router as signinRouter };
