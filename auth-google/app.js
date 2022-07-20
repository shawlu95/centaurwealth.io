require('./services/passport');
const session = require('express-session');
const express = require('express');
const passport = require('passport');

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
    successRedirect: '/',
    failureRedirect: '/auth/signin',
  })
);

app.get('/api/auth/google/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Goodbye!');
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
