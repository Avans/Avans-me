'use strict';

const express = require('express');
const passport = require('passport');
const session = require('express-session');

const AvansStrategy = require('passport-avans').Strategy;
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(profile, done) {
    done(null, profile);
});

passport.use(new AvansStrategy({
    consumerKey: 'a426c4d5174434743b80fb514446fe221093df73',
    consumerSecret: '10b969d02eb3dc1d198e4b47df899887fa60baec',
    callbackURL: '/callback'
  },
  function(token, tokenSecret, profile, done) {
    done(null, profile);
  }
));

const app = express();
app.set('json spaces', 4);
app.use(session({secret: 'secret', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', passport.authenticate('avans'));
app.get('/callback', passport.authenticate('avans', { successRedirect: '/me', failureRedirect: '/' }));
app.get('/me', function(req, res) {
    res.json(req.user);
});

app.listen(process.env.PORT || 3000);
