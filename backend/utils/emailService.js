import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

const transporter = nodemailer.createTransport({
  service: config.email.service,
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${config.frontend.url}/auth/verify-email?token=${token}`;
  
  const mailOptions = {
    from: config.email.from,
    to: email,
    subject: 'Verify your email address',
    html: `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationLink}">${verificationLink}</a>
      <p>This link will expire in 24 hours.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetLink = `${config.frontend.url}/auth/reset-password?token=${token}`;
  
  const mailOptions = {
    from: config.email.from,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

export const sendOrderConfirmation = async (email, orderData) => {
  const itemsList = orderData.items
    .map((item) => `<li>${item.name} x${item.quantity} - ₹${item.itemTotal}</li>`)
    .join('');

  const mailOptions = {
    from: config.email.from,
    to: email,
    subject: 'Order Confirmation',
    html: `
      <h1>Order Confirmed!</h1>
      <p>Thank you for your order from ${orderData.restaurantName}.</p>
      <h3>Order Details:</h3>
      <ul>${itemsList}</ul>
      <p><strong>Total: ₹${orderData.totalAmount}</strong></p>
      <p>Estimated Delivery Time: ${orderData.estimatedTime} minutes</p>
      <p>Track your order at: ${config.frontend.url}/orders/${orderData.orderId}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

export const sendOrderDelivered = async (email, orderData) => {
  const mailOptions = {
    from: config.email.from,
    to: email,
    subject: 'Your Order Has Been Delivered!',
    html: `
      <h1>Order Delivered!</h1>
      <p>Your order from ${orderData.restaurantName} has been delivered.</p>
      <p>Order ID: ${orderData.orderId}</p>
      <p>Please rate your experience: ${config.frontend.url}/orders/${orderData.orderId}/review</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};
