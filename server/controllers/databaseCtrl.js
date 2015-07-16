var mongoose = require('mongoose');

(function () {
    'use strict';

    module.exports = function(){
        var module = {};

        module.connect = function(){
            var dbConnectionString = 'mongodb://localhost:27037/gaza';
            mongoose.connect(dbConnectionString);
            var db = mongoose.connection;

            db.on('error', console.error.bind(console, 'db connection error'));
            db.once('open', function () {
                console.log('Opened db connection to: ' + dbConnectionString);
            });
        };

        return module;
    };

})();
