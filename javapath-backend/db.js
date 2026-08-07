/**
 * JavaPath Pro - Database & Persistence Layer
 * Designed & Developed by Patnala Uday Kumar
 * Repository: https://github.com/UdayPatnala/Java-Path
 */

const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const dbStorage = process.env.DB_STORAGE
  ? path.resolve(process.env.DB_STORAGE)
  : path.join(__dirname, 'javapath.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbStorage,
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
