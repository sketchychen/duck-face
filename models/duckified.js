'use strict';
module.exports = function(sequelize, DataTypes) {
  var duckified = sequelize.define('duckified', {
    cloudID: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    public: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        models.duckified.belongsTo(models.user);
      }
    }
  });
  return duckified;
};
