const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { User } = require('../models');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.json({ message: 'If an account with that email exists, we sent you a reset link.' });
    }

    // Generate a reset token (valid for 1 hour)
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    
    // Reset Link (Assuming frontend runs on port 5173)
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    // Configure Transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'NetSocial'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset Request - NetSocial',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #e50914;">NetSocial Password Reset</h2>
          <p>You requested a password reset for your NetSocial account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" style="background-color: #e50914; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">Reset Password</a>
          <p style="font-size: 12px; color: #777;">This link expires in 1 hour.</p>
          <p style="font-size: 12px; color: #777;">If you didn't ask for this, you can ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
    res.json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    // Verify Token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (err) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Find User
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash New Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update User
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now login.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
