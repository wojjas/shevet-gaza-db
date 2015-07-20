var mongoose = require('mongoose');

(function () {
    'use strict';

    module.exports = function(){
        var module = {};

        module.connect = function(){
            var dbConnectionString = 'mongodb://localhost:27037/gaza';
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
