
let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;

let User = require('../models/user');

let config = require('../config/database');

module.exports = (passport) => {

    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {

        User.findOne({ id: jwt_payload.id }, (err, user) => {
            if (err)
                return done(err, false)

            if (user)
                return done(null, user)
            else
                done(null, false)

        })

    }))

}