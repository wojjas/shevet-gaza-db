var mongoose = require('mongoose');

(function () {
    'use strict;'

    module.exports = mongoose.model('Doctor', {
        "name":"String",
        "cellPhone":"String",
        "officePhone":"String",
        "officeFax":"String",
        "homeFax":"String",
        "homePhone":"String",
        "email":"String"
    });
})();