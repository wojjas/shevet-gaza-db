var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-jwt-bearer');

var User = require('../models/user.js');
var pjson = require('../../package.json');

module.exports = function(){
    var module = {};

    module.tokenSecret = "Should I use crypto to generate unique byte-sequence to use here?";
    module.tokenIssuer = "www.proxoft.se, app: " + pjson.name + " ver: " + pjson.version;

    passport.use('basic', new BasicStrategy(
        function (username, password, callback) {
            User.findOne({username: username}, function(err, user){
                if(err){
                    return callback(err);
                }

                //No user found with that user name:
                if(!user){
                    console.log("User %s failed to login, not found in db.", username);
                    return callback(null, false);
                }

                //Make sure the password is correct:
                user.verifyPassword(password, function(err, isMatch){
                    if(err){
                        return callback(err);
                    }

                    //Password did not match:
                    if(!isMatch) {
                        console.log("User %s provided incorrect password.", username);
                        return callback(null, false);
                    }

                    //Password matched:
                    return callback(null, user);
                });
            });
        }
    ));

    // This strategy verifies the token's signature and decodes it at the same time.
    passport.use('bearer', new BearerStrategy(
        module.tokenSecret,
        {issuer:module.tokenIssuer},
        function (token, callback) {

            if(isTokenExpired(token)){
                console.log("Authorization failed, provided token has expired.");
                return callback(null, false);
            }

            User.findById(token.sub, function(err, user){
                if(err){
                    return callback(err);
                }

                //User specified by token not found:
                if(!user){
                    console.log("Authorization failed, token.sub not found in db.");
                    return callback(null, false);
                }

                return callback(null, user);
            });
        }
    ));

    module.isAuthenticated = passport.authenticate('basic', {session : false});  // Use for authentication at login
    module.isTokenValid = passport.authenticate('bearer', {session : false});    // Use to protect any other route

    function isTokenExpired(token){
        return token.exp < new Date().getTime();
    }

    return module;
};

