var mongoose = require('mongoose');

(function () {
    'use strict;'

    var ContactSchema = mongoose.Schema(
        {
            id: {type: Number, min: 0},
            name: {type: String, trim: true},
            birthDate: {type: Date},
            notes: {type: String, trim: true},
            photo: {type: String, trim: true},
            contactNumbers : [{
                description : {type: String, trim: true},
                number : {type: String, trim: true},
                _id : false
            }],
            modifiedOn: { type : Date, default: Date.now },  //if unset at save (create), timeStamp will be set to current time.
            modifiedBy: {type: String, trim: true}
        }, {
            collection:'contacts' //Optional but helps to understand what's going on.
        }                         //If omitted mongoose will add an "s" to Contact below and
                                  //refer to collection contacts. Which IMO is not clear.
    );

    module.exports = mongoose.model('Contact', ContactSchema);
})();