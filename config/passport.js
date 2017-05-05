// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var db = require("../models");
var bcrypt = require('bcrypt-nodejs');

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        db.User.findOne({
            where: {
              id: id
            },
        }).then(function(result) {
            done(null, result);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            nameField : 'name',
            emailField : 'email',
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            db.User.findOne({
                where: {
                  login: username
                },
            }).then(function(result) {
                // if (err)
                //     return done(err);
                if (result !== null) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {

                    var newUserMysql = {
                        name: req.body.name,
                        email: req.body.email,
                        login: username,
                        password: bcrypt.hashSync(password, null, null)
                    };

                    db.User.create(
                        newUserMysql
                    ).then(function(result) {
                        newUserMysql.id = result.id;
                        db.User_Record.create({
                            wins: 0,
                            losses: 0,
                            disconnects: 0,
                            UserId: result.id
                        }).then(function(result) {
                            return done(null, newUserMysql);
                        });
                    });
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            // console.log('---------------------');
            // console.log(username + ' - ' + password);
            // console.log('---------------------');
            db.User.findOne({
                where: {
                  login: username
                },
            }).then(function(result) {
            //connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
                // if (err)
                //     return done(err);
                if (result === null) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, result.password))
                //if (password != result.password)
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, result);
            });
        })
    );
};

// module.exports = connection;
