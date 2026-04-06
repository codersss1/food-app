import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { generateTokens } from '../middleware/auth.js';
import { validateEmail, validatePassword, validatePhone, validateStudentId } from '../utils/validators.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailService.js';
import { generateToken } from '../utils/helpers.js';
import crypto from 'crypto';

export const signup = async (req, res, next) => {
  const { email, password, fullName, phone } = req.body;

  // Validation
  if (!email || !password || !fullName || !phone) {
    return next(new AppError('All fields are required', 400));
  }

  if (!validateEmail(email)) {
    return next(new AppError('Invalid email format', 400));
  }

  if (!validatePassword(password)) {
    return next(new AppError('Password must be at least 6 characters with uppercase, lowercase, and numbers', 400));
  }

  if (!validatePhone(phone)) {
    return next(new AppError('Invalid phone number', 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already registered', 400));
  }

  // Create user
  const verificationToken = generateToken();
  const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

  const user = new User({
    email,
    passwordHash: password,
    fullName,
    phone,
    verificationToken: hashedVerificationToken,
  });

  await user.save();

  // Send verification email
  await sendVerificationEmail(email, verificationToken);

  res.status(201).json({
    success: true,
    message: 'Signup successful. Please verify your email.',
    userId: user._id,
  });
};

export const verifyEmail = async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(new AppError('Verification token is required', 400));
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ verificationToken: hashedToken });

  if (!user) {
    return next(new AppError('Invalid or expired verification token', 400));
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Email verified successfully',
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    return next(new AppError('User not found', 401));
  }

  if (!user.isVerified) {
    return next(new AppError('Please verify your email first', 401));
  }

  const isPasswordValid = await user.matchPassword(password);

  if (!isPasswordValid) {
    return next(new AppError('Invalid credentials', 401));
  }

  const { accessToken, refreshToken } = generateTokens(user._id);

  res.json({
    success: true,
    message: 'Login successful',
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      isLpuStudent: user.isLpuStudent,
      hostelId: user.hostelId,
    },
    accessToken,
    refreshToken,
  });
};

export const logout = (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful',
  });
};

export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new AppError('Refresh token is required', 400));
  }

  try {
    const decoded = require('jsonwebtoken').verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('User not found', 401));
    }

    const { accessToken: newAccessToken } = generateTokens(user._id);

    res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(new AppError('Invalid refresh token', 401));
  }
};

export const verifyStudent = async (req, res, next) => {
  const { studentId } = req.body;
  const userId = req.userId;

  if (!studentId) {
    return next(new AppError('Student ID is required', 400));
  }

  if (!validateStudentId(studentId)) {
    return next(new AppError('Invalid student ID format', 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 401));
  }

  // Check if student ID already exists
  const existingStudent = await User.findOne({ studentId });
  if (existingStudent) {
    return next(new AppError('This student ID is already registered', 400));
  }

  user.studentId = studentId;
  user.isLpuStudent = true;
  await user.save();

  res.json({
    success: true,
    message: 'Student verification completed',
    user: {
      id: user._id,
      email: user.email,
      isLpuStudent: user.isLpuStudent,
      studentId: user.studentId,
    },
  });
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Email is required', 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const resetToken = generateToken();
  const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.passwordResetToken = hashedResetToken;
  user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
  await user.save();

  await sendPasswordResetEmail(email, resetToken);

  res.json({
    success: true,
    message: 'Password reset link sent to your email',
  });
};

export const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return next(new AppError('Token and password are required', 400));
  }

  if (!validatePassword(password)) {
    return next(new AppError('Password must be at least 6 characters with uppercase, lowercase, and numbers', 400));
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Invalid or expired reset token', 400));
  }

  user.passwordHash = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successful',
  });
};
