const sequelize = require('../config/db');
const User = require('./User');
const Activity = require('./Activity');
const Follow = require('./Follow');
const Like = require('./Like');
const Comment = require('./Comment');

// User - Activity
User.hasMany(Activity);
Activity.belongsTo(User);

// User - Follow
User.belongsToMany(User, { as: 'Followers', through: Follow, foreignKey: 'followingId' });
User.belongsToMany(User, { as: 'Following', through: Follow, foreignKey: 'followerId' });

// User - Like
User.hasMany(Like);
Like.belongsTo(User);

// Activity - Like
Activity.hasMany(Like);
Like.belongsTo(Activity);

// User - Comment
User.hasMany(Comment);
Comment.belongsTo(User);

// Activity - Comment
Activity.hasMany(Comment);
Comment.belongsTo(Activity);

const db = {
  sequelize,
  User,
  Activity,
  Follow,
  Like,
  Comment
};

module.exports = db;
