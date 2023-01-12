const bcrypt = require('bcrypt');

/**
 * Hashing Password
 * @param {string} userPassword 
 * @returns {string} hash
 */
const hashPassword = (userPassword) => {
    let saltRounds = 10;
    let salt = bcrypt.genSaltSync(saltRounds);
    let hash = bcrypt.hashSync(userPassword, salt);

    return hash;
}

/**
 * Comparing Password
 * @param {*} userPassword 
 * @param {*} hashedPassword 
 * @returns
 */
const comparePassword = (userPassword, hashedPassword) => bcrypt.compareSync(userPassword, hashedPassword);

module.exports = {
    hashPassword,
    comparePassword
};