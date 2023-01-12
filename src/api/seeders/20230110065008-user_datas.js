'use strict';

const { hashPassword } = require('../helpers/bcrypt');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('users', [
      {
        uuid: uuidv4(),
        firstName: 'Admin',
        lastName: 'istrator',
        email: 'admin@admin.com',
        username: 'admin',
        password: hashPassword('password'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uuid: uuidv4(),
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        username: 'john.doe',
        password: hashPassword('password'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
