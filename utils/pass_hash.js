'use strict';
var crypto = require('crypto');

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

/**
 * return the password hash object
 * @param {String} userpassword 
 */
var saltHashPassword = function(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    return sha512(userpassword, salt);
}

/**
 * compare the password with password hash
 * @param {Object} passwordHashObj 
 * @param {String} password 
 */
var comparePassword = function(passwordHashObj, password){
    try {
        let {
            salt,
            passwordHash
        } = passwordHashObj;
    
        let passwordObj = sha512(password,salt);
        if (passwordObj.passwordHash == passwordHash) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

module.exports = {
    saltHashPassword,
    comparePassword
};