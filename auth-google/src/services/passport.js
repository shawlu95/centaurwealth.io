const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../model/user');
const jwt = require('jsonwebtoken');
const {
  UserSignupPublisher,
} = require('../events/publishers/user-signup-publisher');
const { natsWrapper } = require('../nats-wrapper');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CLIENT_CALLBACK,
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      const { name, email } = profile._json;
      var user = await User.findOne({ email });

      if (!user) {
        user = new User({ email, name });
        new UserSignupPublisher(natsWrapper.client).publish({
          id: user.id,
          email: user.email,
        });
      } else {
        user.set({ name });
      }

      await user.save();
      return done(null, { id: user.id, email: user.email });
    }
  )
);

passport.serializeUser(function (user, done) {
  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.jwt
  );

  done(null, { jwt: userJwt });
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
