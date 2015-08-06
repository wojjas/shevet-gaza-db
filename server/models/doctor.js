var mongoose = require('mongoose');

(function () {
    'use strict;'

    var DoctorSchema = mongoose.Schema({
        name: {type: String, trim: true},
        cellPhone: {type: String, trim: true},
        officePhone: {type: String, trim: true},
        officeFax: {type: String, trim: true},
        homeFax: {type: String, trim: true},
        homePhone: {type: String, trim: true},
        email: {type: String, trim: true},
        modifiedOn: {type : Date, default: Date.now },  //if unset at save (create), timeStamp will be set to current time.
        modifiedBy: {type: String, trim: true}
    }, {
        collection:'doctors'}   //Optional but helps to understand what's going on.
    );                          //If omitted mongoose will add an "s" to Doctor below and
                                //refer to collection doctors. Which IMO is not clear.

    module.exports = mongoose.model('Doctor', DoctorSchema);
})();
