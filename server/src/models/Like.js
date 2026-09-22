const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Like = sequelize.define('Like', {});

// Associations defined in index.js usually, but can be here too.
// We will define them centrally in index.js to avoid circular deps issues if possible, 
// or just export the model.

module.exports = Like;
