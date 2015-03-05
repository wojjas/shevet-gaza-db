var mongoose = require('mongoose');

(function () {
    'use strict;'

    var PatientSchema = mongoose.Schema(
        {
            childId: {type: String, trim: true},
            firstName: {type: String, trim: true},
            middleName: {type: String, trim: true},
            lastName: {type: String, trim: true},
            gender: "String",
            birthDate: "String",    /*TODO: Use Date*/
            address: {type: String, trim: true},
            countryRegion: {type: String, trim: true},
            homePhone: {type: String, trim: true},
            cellPhone: {type: String, trim: true},
            workPhone: {type: String, trim: true},
            fax: {type: String, trim: true},
            email: {type: String, trim: true},
            house: {type: String, trim: true},
            rooms: "Number",        /*TODO: use min/max or don't use this field at all?*/
            siblings: {type: Number, min: 0, max: 32},
            siblingsWithHartDisease: "Boolean",
            parentsRelated: "Boolean",
            diagnosis: {type: String, trim: true},
            dateReferredToUs: "String",     //TODO: Use Date
            dateFirstEval: "String",        //TODO: Use Date
            currentlyInHospital: "Boolean",
            dateDeceased: "String",        //TODO: Use Date
            parentsCalling: "Boolean",
            doctor: {type: String, trim: true}               //TODO: Use id to doctor instead!?
        }, {
            collection:'patients' //Optional but helps to understand what's going on.
        }                         //If omitted mongoose will add an "s" to Patient below and
                                  //refer to collection patients. Which IMO is not clear.
    );

    module.exports = mongoose.model('Patient', PatientSchema);
})();