const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
  return jwt.sign(user, process.env.SECRET, { expiresIn: 3600 });
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("JWT payload", jwt_payload);
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(err, false);
      }
    });
  })
);

exports.getUserId = (token) => {
  return jwt.verify(token, process.env.SECRET);
};

exports.verifyUser = passport.authenticate("jwt", { session: false });
exports.verifyAdmin = (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    const err = new Error("You are not authorized to perform this operation");
    err.status = 403;
    next(err);
  }
};

/**
 * List of things to using jwt
 * import passport as passport
 * import JwtStrategy from passort.Stragetgy
 * import ExtractJwt from passport.Extract
 * require jsonwebtoken as jwt
 * exports getToken which take user as parameter and return jwt.sign(user, secret)
 * create opts = {}
 * set the value for jwtFromRequest
 * set the valur for secretOrKey
 * export jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done)))
 * exports.verifyUser = passport.authenticate('jwt', {session: false})
 */
