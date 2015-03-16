var mongoose = require('mongoose');

(function () {
    'use strict;'

    var ContactSchema = mongoose.Schema(
        {
            id: {type: String, trim: true},
            name: {type: String, trim: true},
            birthDate: {type: String, trim: true}    /*TODO: Use Date*/
            /*TODO: add contactData, array with description and data in each element*/
        }, {
            collection:'contacts' //Optional but helps to understand what's going on.
        }                         //If omitted mongoose will add an "s" to Contact below and
                                  //refer to collection contacts. Which IMO is not clear.
    );

    module.exports = mongoose.model('Contact', ContactSchema);
})();