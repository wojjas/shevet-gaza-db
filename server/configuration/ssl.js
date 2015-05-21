var fs = require('fs');
var https = require('https');

var key_file = 'C:/Users/Wojtek/Documents/Dev/SPA/Corazon/Dev/shevet-gaza/server/gdtest.key';
var crt_file = 'C:/Users/Wojtek/Documents/Dev/SPA/Corazon/Dev/shevet-gaza/server/gdtest.crt';
var passPhrase = "this is optional";

module.exports = function(app){
    var sslOptions = {};

    var options = {
        key: fs.readFileSync(key_file),
        cert: fs.readFileSync(crt_file)
    };
    if(passPhrase){
        options.passphrase = passPhrase;
    }

    sslOptions.options = options;
    sslOptions.https = https;

    return sslOptions;
}