var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

(function () {
    'use strict;'

    var UserSchema = mongoose.Schema({
            username: {type: "String", unique: true, required: true},
            password: {type: "String", required: true}
       }, {
            collection:'users'} //Optional but helps to understand what's going on.
    );                          //If omitted mongoose will add an "s" to User below and
                                //refer to collection users. Which IMO is not clear.

    //Execute before each user.save() call:
    UserSchema.pre('save', function (callback) {
        var user = this;

        console.log('User pre-save, saving user-object: ', user);

        if(!user.isModified('password')){
            return callback();
        }

        bcrypt.genSalt(10, function(err, salt){
            if(err){
                return callback(err);
            }

            bcrypt.hash(user.password, salt, null, function(err, hash){
                if(err){
                    return callback(err);
                }
                user.password = hash;
                callback();
            });
        });
    });

    UserSchema.pre("update", function(callback){
        console.log('User pre-update, object: ', this);

        return callback();
    });
    
    UserSchema.methods.verifyPassword = function (password, callback) {
        bcrypt.compare(password, this.password, function (err, isMatch) {
            if(err) {
                return callback(err);
            }
            callback(null, isMatch);
        });
    };

    module.exports = mongoose.model('User', UserSchema);
})();