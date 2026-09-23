const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_fallback_secret_lead_manager';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_fallback_secret_lead_manager';
const ACCESS_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString()
    },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES_IN }
  );
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
