var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

module.exports = function(){
    var User = require('../models/user.js');

    var module = {};

    passport.use(new BasicStrategy(
        function (username, password, callback) {
            User.findOne({username: username}, function(err, user){
                if(err){
                    return callback(err);
                }

                //No user found with that user name:
                if(!user){
                    return callback(null, false);
                }

                //Make sure the password is correct:
                user.verifyPassword(password, function(err, isMatch){
                    if(err){
                        return callback(err);
                    }

                    //Password did not match:
                    if(!isMatch) {
                        return callback(null, false);
                    }

                    //Password matched:
                    return callback(null, user);
                });
        });
    }));

    module.isAuthenticated = passport.authenticate('basic', {session : false});

    return module;
};

