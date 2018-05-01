const passport = require('passport');
const passportJwt = require('passport-jwt');
const User = require('../api/users/model');

const initialize = () => passport.initialize();
const authenticate = () => passport.authenticate('jwt', { session : false });

function setJwtStrategy () {
  const opts = {
    jwtFromRequest    : passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey       : process.env.JWT_SECRET,
    passReqToCallback : true
  };
  const strategy = new passportJwt.Strategy(opts, (req, jwtPayload, done) => {
    const _id = jwtPayload.id;
    User.findOne({ _id }, (err, user) => {
      if (err) done(err, false);
      done(null, user || false);
    });
  });

  passport.use(strategy);
}

module.exports = {
  initialize,
  authenticate,
  setJwtStrategy,
};