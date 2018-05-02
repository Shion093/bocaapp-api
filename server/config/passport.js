const passport = require('passport');
const passportJwt = require('passport-jwt');
const User = require('../api/users/model');

const initialize = () => passport.initialize();
const authenticate = () => {
  return (req, res, next) => {
    passport.authenticate('jwt', { session : false }, async (err, data, info) => {
      console.log(data);
      console.log(info.name);
      if (info.name === 'TokenExpiredError') {
        console.log(req.headers['x-refresh-token']);
        const tokens = await User.refreshTokens(req.headers['x-refresh-token']);
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', 'hola');
        res.set('x-refresh-token', 'hola');
      }
      if (err || info) {
        res.status(401).json({ message : 'Unauthorized' })
      } else {
        next();
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
    console.log(jwtPayload);
    console.log(req);
    const _id = jwtPayload._id;
    User.findOne({ _id }, (err, user) => {
      if (err) return done(err, false);
      if (!user) {
        return done(null, false);
      }
      return done(null, user)
    });
  });

  passport.use(strategy);
}

module.exports = {
  initialize,
  authenticate,
  setJwtStrategy,
};