const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Activity = sequelize.define('Activity', {
  type: {
    type: DataTypes.ENUM('RATING', 'REVIEW', 'ADD_TO_LIST'),
    allowNull: false
  },
  contentType: {
    type: DataTypes.ENUM('MOVIE', 'BOOK'),
    allowNull: false
  },
  contentId: {
    type: DataTypes.STRING, // External API ID
    allowNull: false
  },
  contentTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contentPoster: {
    type: DataTypes.STRING
  },
  rating: {
    type: DataTypes.FLOAT, // 1-10
    allowNull: true
  },
  reviewText: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  listName: {
    type: DataTypes.STRING, // e.g., "Watched", "To Read"
    allowNull: true
  }
});

module.exports = Activity;
