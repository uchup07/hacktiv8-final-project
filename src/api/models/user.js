'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
const {v4: uuidv4} = require('uuid'); // for using uuid

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.TaskGroup);
    }
  }
  User.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: uuidv4()
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false, // required if validation using notNull
      validate: {
        notNull: {
          msg: "Please Enter Your First Name",
        },
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false, // required if validation using notNull
      validate: {
        notNull: {
          msg: "Please Enter Your Last Name",
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false, // required if validation using notNull
      unique: true,
      validate: {
        notNull: {
          msg: "Please Enter Your Email",
        },
        isEmail: true,
        // create custom validate for check unique data
        isUnique: function(value, next) {
          var self = this;
          User.findOne({
              where: {email: value},
              attributes: ['id']
          })
            .then(function (user) {
              // reject if a different user wants to use the same email
              if (user && self.id !== user.id) {
                  return next('Email already in use!');
              }
              return next();
          })
          .catch(function (err) {
              return next(err);
          });
        
        },
        
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Please Enter Your Username",
        },
        // create custom validate for check unique data
        isUnique: function(value, next) {
          var self = this;
          User.findOne({
              where: {username: value},
              attributes: ['id']
          })
            .then(function (user) {
              // reject if a different user wants to use the same email
              if (user && self.id !== user.id) {
                  return next('Username already in use!');
              }
              return next();
          })
          .catch(function (err) {
              return next(err);
          });
        
        },
        is: {
          args: /^[a-z0-9_-]{3,16}$/i, // check regex for username
          msg: "Username Invalid"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // required if validation using notNull
      validate: {
        notNull: {
          msg: "Please Enter Your Password",
        },
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    scopes: {
      withoutPassword: {
        attributes: { exclude: ['password'] }, // exclude password attribute if scope using withoutPassword
      },
      withoutId: {
        attributes: { exclude: ['id']}, // exclude id attribute if scope using withoutId
      },
    },
    hooks: {
      /**
       * Before execute create
       * @param {Object} user Object for user
       * @param {Object} opt Object for options
       */
      beforeCreate: (user, opt) => {
        let hashedPassword = hashPassword(user.password); // let hash password
        user.password = hashedPassword;
      },
      beforeCount: function (options) {
        if (this._scope.include && this._scope.include.length > 0) {
          options.distinct = true
          options.col = this._scope.col || options.col || `"${this.options.name.singular}".id`
        }
      
        if (options.include && options.include.length > 0) {
          options.include = null
        }
      }
    }
  });
  return User;
};