'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: DataTypes.UUIDV4 // Or DataTypes.UUIDV4
      },
      description: {
        type: Sequelize.STRING
      },
      TaskGroupId: {
        type: Sequelize.INTEGER,
      },
      completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      completedAt: {
        type: Sequelize.DATE
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

    await queryInterface.addConstraint("tasks", {
      fields:["TaskGroupId"],
      type:"foreign key",
      name:"task_group_fk",
      references: {
        table: "task_groups",
        field:"id"
      },
      onDelete:"cascade",
      onUpdate:"cascade"
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tasks');
  }
};