import passport from 'passport';
import localStrategy from 'passport-local';
import { User } from '../model/user';
import { Password } from './password';
import jwt from 'jsonwebtoken';

import { BadRequestError } from '@bookkeeping/common';

passport.use(
  new localStrategy.Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async function (email, password, done) {
      const user = await User.findOne({ email });

      if (!user) {
        return done(new BadRequestError('Invalid credential'), false);
      }

      const match = await Password.compare(user.password, password);
      if (!match) {
        return done(new BadRequestError('Invalid credential'), false);
      }

      return done(null, { id: user.id, email: user.email });
    }
  )
);

passport.serializeUser(function (user, done) {
  const userJwt = jwt.sign(
    {
      // @ts-ignore
      id: user.id,
      // @ts-ignore
      email: user.email!,
    },
    process.env.jwt!
  );

  done(null, { jwt: userJwt });
});

passport.deserializeUser(function (user, done) {
  // @ts-ignore
  done(null, user);
});
