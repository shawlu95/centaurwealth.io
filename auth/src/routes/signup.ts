import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../model/user';
import { validateRequest, BadRequestError } from '@bookkeeping/common';
import { StatusCodes } from 'http-status-codes';
import { UserSignupPublisher } from '../events/publishers/user-signup-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const validators = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Length must be 4~20'),
];

router.post(
  '/api/auth/signup',
  validators,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });
    await user.save();

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.jwt!
    );

    // attach jwt to cookie (must be https protocol)
    req.session = { jwt: userJwt };

    new UserSignupPublisher(natsWrapper.client).publish({
      id: user.id,
      email: user.email,
    });

    // send a cookie/jwt
    return res.status(StatusCodes.CREATED).send(user);
  }
);

export { router as signupRouter };
