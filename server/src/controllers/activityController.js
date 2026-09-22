const { Activity, User, Follow, Like, Comment } = require('../models');
const { Op } = require('sequelize');

exports.getFeed = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get list of users followed by current user
    const following = await Follow.findAll({
      where: { followerId: userId },
      attributes: ['followingId']
    });

    const followingIds = following.map(f => f.followingId);
    followingIds.push(userId); // Include own activities

    const activities = await Activity.findAll({
      where: {
        UserId: {
          [Op.in]: followingIds
        }
      },
      include: [
        { model: User, attributes: ['id', 'username', 'avatar'] },
        { model: Like, attributes: ['UserId'] },
        { 
          model: Comment, 
          include: [{ model: User, attributes: ['username', 'avatar'] }],
          order: [['createdAt', 'ASC']] // Oldest first
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 15,
      offset: req.query.offset || 0
    });

    // Transform data to add isLiked, likeCount, commentCount
    const feed = activities.map(act => {
      const plain = act.get({ plain: true });
      plain.likeCount = plain.Likes.length;
      plain.commentCount = plain.Comments.length;
      plain.isLiked = plain.Likes.some(l => l.UserId === userId);
      return plain;
    });

    res.json(feed);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createActivity = async (req, res) => {
  try {
    const { type, contentType, contentId, contentTitle, contentPoster, rating, reviewText, listName } = req.body;
    
    const activity = await Activity.create({
      UserId: req.user.id,
      type,
      contentType,
      contentId,
      contentTitle,
      contentPoster,
      rating,
      reviewText,
      listName
    });

    // Fetch user to return with activity
    const fullActivity = await Activity.findByPk(activity.id, {
      include: [{ model: User, attributes: ['id', 'username', 'avatar'] }]
    });

    // Add empty likes/comments for consistency
    const plain = fullActivity.get({ plain: true });
    plain.likeCount = 0;
    plain.commentCount = 0;
    plain.isLiked = false;
    plain.Comments = [];

    res.status(201).json(plain);
  } catch (error) {
    console.error('Create Activity Error:', error);
    res.status(500).json({ message: 'Server error creating activity', error: error.message });
  }
};

exports.getUserActivities = async (req, res) => {
  try {
    const { userId } = req.params;
    const activities = await Activity.findAll({
      where: { UserId: userId },
      include: [
        { model: User, attributes: ['id', 'username', 'avatar'] },
        { model: Like, attributes: ['UserId'] },
        { model: Comment, include: [{ model: User, attributes: ['username'] }] }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Transform data
    const feed = activities.map(act => {
      const plain = act.get({ plain: true });
      plain.likeCount = plain.Likes.length;
      plain.commentCount = plain.Comments.length;
      // For public profile, we might not know if the *viewer* liked it unless we pass viewer ID.
      // For now, let's assume we just want the counts.
      // If we want isLiked, we need the current user's ID from req.user (if authenticated)
      if (req.user) {
        plain.isLiked = plain.Likes.some(l => l.UserId === req.user.id);
      }
      return plain;
    });

    res.json(feed);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const activityId = req.params.id;
    const userId = req.user.id;

    const existingLike = await Like.findOne({ where: { ActivityId: activityId, UserId: userId } });

    if (existingLike) {
      await existingLike.destroy();
      res.json({ liked: false });
    } else {
      await Like.create({ ActivityId: activityId, UserId: userId });
      res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const activityId = req.params.id;
    const userId = req.user.id;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const comment = await Comment.create({
      ActivityId: activityId,
      UserId: userId,
      text
    });
    
    const fullComment = await Comment.findByPk(comment.id, {
        include: [{ model: User, attributes: ['username', 'avatar'] }]
    });

    res.json(fullComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
