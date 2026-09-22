const { Sequelize } = require('sequelize');
const path = require('path');

// SQLite for immediate development (no installation required)
// To use PostgreSQL:
// const sequelize = new Sequelize('database', 'username', 'password', {
//   host: 'localhost',
//   dialect: 'postgres'
// });

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false
});

module.exports = sequelize;
