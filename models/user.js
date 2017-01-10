"use strict";

var bcrypt = require("bcrypt");

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    email: { // originally email: DataTypes.STRING,
      type: DataTypes.STRING,
      validate: { // attach a validation via sequelize (email formatting in this case)
        isEmail: { // can be just isEmail: true if we want to use default error message
          msg: "Invalid email address."
        }
      }
    },
    name: { // originally name: DataTypes.STRING,
      type: DataTypes.STRING,
      validate: { // attach a validation via sequelize
        len: { // username length in this case
          args: [1, 99],
          msg: "Name must be between 1 and 99 characters long."
        }
      }
    },
    password: { // originally password: DataTypes.STRING,
      type: DataTypes.STRING,
      validate: { // attach a validation via sequelize
        len: { // password length in this case
          args: [8, 99],
          msg: "Password must be between 8 and 99 characters long."
        }
      }
    }
  }, {
    hooks: { // happens before or after things happen. when defined here it will apply to each user in the user model. this is NOT a GLOBAL HOOK, which means it will happen for all models
      // this particular hook happens before each user gets created/added to the user model
      beforeCreate: function(createdUser, options, callback) { // beforeCreate(instance, options, fn), fn is a callback function that is called with attributes, options
        var hash = bcrypt.hashSync(createdUser.password, 10); // encrypt the password
        createdUser.password = hash; // save it to the user
        callback(null, createdUser); // i'm going to guess this means to proceed creation with the now modified createdUser
      } // like a return but with functions instead of pure values?
    },
    classMethods: { // to define 1:M or M:M relationships
      associate: function(models) {
        models.user.hasMany(models.duckified);
      }
    },
    instanceMethods: { // Provide functions that are added to each instance
      validPassword: function(password) { // here we create a function called "validPassword(password)" to attach to each specific user instance
        return bcrypt.compareSync(password, this.password); // "this" refers to the specific user object that the particular validPassword() is attached to
      },
      toJSON: function() { // here we create a function called toJSON()
        var jsonUser = this.get(); // "this" gets specific user object and saves it separately (like a temporary copy)
        delete jsonUser.password; // we are deleting the password from the copied user object
        return jsonUser; // so that it can't be accessed when toJSON() is called
      }
    }
  });
  return user;
};
