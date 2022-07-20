require('./services/passport');
const session = require('express-session');
const express = require('express');
const passport = require('passport');

const { User } = require('./model/user');
const { StatusCodes } = require('http-status-codes');
const app = express();

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get(
  '/api/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/api/auth/google/success',
    failureRedirect: '/auth/signin',
  })
);

app.get('/api/auth/google/success', async (req, res) => {
  const { name, email } = req.user._json;
  const user = await User.findOne({ email });
  user.set({ name });
  await user.save();
  res.status(StatusCodes.OK).send({ user });
});

app.get('/api/auth/google/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Goodbye!');
});

module.exports = { app };
