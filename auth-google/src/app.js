require('./services/passport');
const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');

const app = express();
app.set('trust proxy', true);

app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get(
  '/api/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/signin',
  }),
  async (req, res) => {
    res.redirect('/home');
  }
);

module.exports = { app };
