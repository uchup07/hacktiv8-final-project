'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('task_groups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      title: {
        type: Sequelize.STRING
      },
      UserId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint("task_groups", {
      fields:["UserId"],
      type:"foreign key",
      name:"user_fk",
      references: {
        table: "users",
        field:"id"
      },
      onDelete:"cascade",
      onUpdate:"cascade"
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('task_groups');
  }
};