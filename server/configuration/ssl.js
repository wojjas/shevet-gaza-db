var fs = require('fs');
var https = require('https');

var key_file = 'C:/Users/Wojtek/Documents/Dev/SPA/Corazon/Dev/shevet-gaza/server/gdtest.key';
var crt_file = 'C:/Users/Wojtek/Documents/Dev/SPA/Corazon/Dev/shevet-gaza/server/gdtest.crt';
var passPhrase = "this is optional";

module.exports = function(app){
    var sslOptions = {};

    var options = {
        key: readFileSync(key_file),
        cert: readFileSync(crt_file),
        areCertFilesRead: function(){
            return this.key && this.cert;
        }
    };
    if(passPhrase){
        options.passphrase = passPhrase;
    }

    sslOptions.options = options;
    sslOptions.https = https;

    return sslOptions;

    function readFileSync(path){
        var retVal = '';

        try{
            retVal = fs.readFileSync(path);
        }catch(e){
            console.log('Failed to read certificate-file: ' + e.message);
        }

        return retVal;
    }
}