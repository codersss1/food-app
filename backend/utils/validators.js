import validator from 'validator';

export const validateEmail = (email) => {
  return validator.isEmail(email);
};

export const validatePassword = (password) => {
  // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
  return regex.test(password);
};

export const validatePhone = (phone) => {
  return validator.isMobilePhone(phone, 'en-IN');
};

export const validateStudentId = (studentId) => {
  // LPU student ID format: 12BECS####
  const regex = /^\d{2}[A-Z]{2}[A-Z]{2}\d{4}$/;
  return regex.test(studentId);
};

export const validateUrl = (url) => {
  return validator.isURL(url);
};

export const validateOrderAmount = (amount) => {
  return Number.isFinite(amount) && amount > 0;
};

export const sanitizeInput = (input) => {
  return validator.escape(input);
};
