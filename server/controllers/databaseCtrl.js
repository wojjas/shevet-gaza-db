var mongoose = require('mongoose');

(function () {
    'use strict';

    module.exports = function(){
        var module = {};

        //'mongodb://heroku_4qkqf86k:86vnv908l5cs9hhdq3t90m7865@ds053858.mongolab.com:53858/heroku_4qkqf86k'; //To remote db for debug purposes
        module.dbConnectionString = process.env.MONGOLAB_URI || 'mongodb://localhost:27037/gaza';

        module.connect = function(){
            mongoose.connect(module.dbConnectionString);
            var db = mongoose.connection;

            db.on('error',function(err){
                    console.log('Failed to connect to db: ' + err);
            });
            db.once('open', function () {
                console.log('Opened db connection to: ' + module.dbConnectionString);
            });
        };

        module.isConnected = function(){
            return mongoose.connection.readyState;
        }

        return module;
    };

})();
