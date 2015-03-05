var mongoose = require('mongoose');

(function () {
    'use strict;'

    var DoctorSchema = mongoose.Schema({
        "name":"String",
        "cellPhone":"String",
        "officePhone":"String",
        "officeFax":"String",
        "homeFax":"String",
        "homePhone":"String",
        "email":"String"
    }, {
        collection:'doctors'}   //Optional but helps to understand what's going on.
    );                          //If omitted mongoose will add an "s" to Doctor below and
                                //refer to collection doctors. Which IMO is not clear.

    module.exports = mongoose.model('Doctor', DoctorSchema);
})();
