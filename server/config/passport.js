const passport = require('passport');
const passportJwt = require('passport-jwt');
const _ = require('lodash');
const User = require('../api/users/model');
const { refreshTokens } = require('../helpers/auth');

const initialize = () => passport.initialize();
const authenticate = () => {
  return (req, res, next) => {
    passport.authenticate('jwt', { session : false }, async (err, data, info) => {
      let tokens = {};
      if (info) {
        tokens = await refreshTokens(req.headers['x-refresh-token']);
        if (_.isEmpty(tokens)) {
          return res.status(401).json({ message : 'Invalid token or expired' })
        }
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', tokens.token);
        res.set('x-refresh-token', tokens.refreshToken);
        req.user = tokens.user;
        return next();
      }
      if (err) {
        return res.status(401).json({ message : 'Unauthorized' })
      } else {
        req.user = data;
        return next();
      }
    })(req, res, next);
  };
};

function setJwtStrategy () {
  const opts = {
    jwtFromRequest    : passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey       : process.env.JWT_SECRET,
    passReqToCallback : true
  };
  const strategy = new passportJwt.Strategy(opts, (req, jwtPayload, done) => {
    const _id = jwtPayload._id;
    return User.findOne({ _id }).then((user) => {
      if (!user) {
        return done(null, false);
      }
      return done(null, user)
    }).catch((err) => {
      return done(err, false);
    })
  });

  passport.use(strategy);
}

module.exports = {
  initialize,
  authenticate,
  setJwtStrategy,
};