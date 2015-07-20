var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var moment = require('moment');
var authCfg = require('../controllers/authCtrl.js')();
var User = require('../models/user.js');

(function () {
    'use strict';

    module.exports = function(app){
        var module = {
            getLogin: getLogin,
            postLogin: postLogin
        };

        return module;


        // This route is protected, req.user is set when request is authenticated thus known in this function.
        function getLogin(req, res){
            var retMessage = "OK";
            var user = req.user._doc;

            // Create token, and return it to client:
            user.token = createToken(user);
            res.send({"status":retMessage, "token":user.token});
        };

        // This route is unprotected.
        // It expects a username and password.
        // If user is found and password matched a token is created and sent to client.
        function postLogin(req, res){
            var retMessage = "OK";

            if(!req.body || !req.body.username || !req.body.password) {
                retMessage = "Failed to login, insufficient credentials provided."
                res.status(401).send({"status": retMessage});
            }else if(!mongoose.connection.readyState){
                retMessage = "Server error, no connection to db, can't verify user credentials.";
                res.status(500).send({"status":retMessage});
            }else{
                User.findOne({"username":req.body.username}, function (err, user) {
                    if(err){
                        retMessage = "Failed to find user.";
                        console.log(retMessage + ": " + err);
                        res.status(401).send({"status":retMessage});
                    }
                    else if(!user){
                        retMessage = "Failed to find user.";
                        console.log(retMessage);
                        res.status(401).send({"status":retMessage});
                    }else {
                        user.verifyPassword(req.body.password, function (err, isMatch) {
                            err && console.log(err);

                            if(isMatch){
                                user.token = createToken(user);
                                res.send({"status":retMessage, "token":user.token});
                            }else{
                                console.log('Login failed, user "%s" found in db but provided invalid password.', req.body.username);
                                res.status(401).send({"status":"Invalid password"});
                            }
                        })
                    }
                });
            }
        }

        function createToken(user){
            var expires = moment().add(9, 'hours').valueOf();
            var payload = {
                "iss":authCfg.tokenIssuer,
                "sub":user._id,
                "exp":expires
            };

            return jwt.encode(payload, authCfg.tokenSecret, 'HS256');
        }
    };

})();