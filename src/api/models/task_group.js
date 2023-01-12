'use strict';
const {
  Model
} = require('sequelize');

const {v4: uuidv4} = require('uuid'); // for using uuid

module.exports = (sequelize, DataTypes) => {
  class TaskGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Task);
      this.belongsTo(models.User);
    }
  }
  TaskGroup.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: uuidv4()
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please Enter your Title',
        }
      }
    },
    UserId: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'TaskGroup',
    tableName: 'task_groups',
    hooks: {
      beforeCount: function (options) {
        if (this._scope.include && this._scope.include.length > 0) {
          options.distinct = true
          options.col = this._scope.col || options.col || `"${this.options.name.singular}".id`
        }
      
        if (options.include && options.include.length > 0) {
          options.include = null
        }
      }
    },
    scopes: {
      withoutId: {
        attributes: { exclude: ['id']}, // exclude id attribute if scope using withoutId
      },
    }
  });
  return TaskGroup;
};