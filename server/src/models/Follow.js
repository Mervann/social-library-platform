const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Follow = sequelize.define('Follow', {});

module.exports = Follow;
