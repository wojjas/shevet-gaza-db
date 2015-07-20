var mongoose = require('mongoose');

(function () {
    'use strict';

    module.exports = function(){
        var module = {};

        module.connect = function(){
            if(process.env.NPM_CONFIG_PRODUCTION){
                var dbConnectionString = 'mongodb://wojjas:test@ds053310.mongolab.com:53310/heroku_app32205191';
                var dbConnectionString = 'mongodb://ds053858.mongolab.com:53858/heroku_4qkqf86k';
            }else{
                var dbConnectionString = 'mongodb://localhost:27037/gaza';
            }

            mongoose.connect(dbConnectionString);
            var db = mongoose.connection;

            db.on('error',function(err){
                    console.log('Failed to connect to db: ' + err);
            });
            db.once('open', function () {
                console.log('Opened db connection to: ' + dbConnectionString);
            });
        };

        return module;
    };

})();
