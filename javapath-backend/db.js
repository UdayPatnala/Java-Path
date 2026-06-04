const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'javapath.sqlite'),
  logging: false
});

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  progress: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  chatHistory: {
    type: DataTypes.JSON,
    defaultValue: []
  }
});

sequelize.sync();

module.exports = { sequelize, User };
