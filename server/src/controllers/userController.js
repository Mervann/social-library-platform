const { User, Follow, Activity } = require('../models');
const { Op } = require('sequelize');

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);

    const users = await User.findAll({
      where: {
        username: {
          [Op.like]: `%${query}%`
        }
      },
      attributes: ['id', 'username', 'avatar'],
      limit: 10
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'email', 'avatar', 'bio', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if following
    const isFollowing = await Follow.findOne({
      where: {
        followerId: currentUserId,
        followingId: id
      }
    });

    // Get counts
    const followersCount = await Follow.count({ where: { followingId: id } });
    const followingCount = await Follow.count({ where: { followerId: id } });

    res.json({
      ...user.toJSON(),
      isFollowing: !!isFollowing,
      followersCount,
      followingCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    const { id } = req.params; // User to follow
    const followerId = req.user.id;

    if (id == followerId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const userToFollow = await User.findByPk(id);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    await Follow.create({
      followerId,
      followingId: id
    });

    res.json({ message: 'Followed successfully' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Already following' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const { id } = req.params; // User to unfollow
    const followerId = req.user.id;

    const deleted = await Follow.destroy({
      where: {
        followerId,
        followingId: id
      }
    });

    if (!deleted) {
      return res.status(400).json({ message: 'Not following' });
    }

    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { avatar, bio } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (avatar) user.avatar = avatar;
    if (bio) user.bio = bio;

    await user.save();

    res.json({ 
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
