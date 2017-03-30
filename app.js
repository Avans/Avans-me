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
    consumerKey: '201cb65cc4f38f60d4f35e677dd5d119a12d9294',
    consumerSecret: '2c9cbe2064fa43d9b57fb47982de3d986f319eda',
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
