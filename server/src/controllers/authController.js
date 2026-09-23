const User = require('../models/User');
const { ROLES } = require('../constants/roles');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} = require('../utils/tokens');

const REFRESH_COOKIE_NAME = 'jid';

const setRefreshTokenCookie = (res, token) => {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered'
      });
    }

    const assignedRole = role && Object.values(ROLES).includes(role) ? role : ROLES.USER;

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: assignedRole
    });

    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    const accessToken = generateAccessToken(user);
    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const incomingToken = req.cookies[REFRESH_COOKIE_NAME] || req.body.refreshToken;

    if (!incomingToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token missing'
      });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(incomingToken);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== incomingToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is no longer valid'
      });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const incomingToken = req.cookies[REFRESH_COOKIE_NAME] || req.body.refreshToken;

    if (incomingToken) {
      try {
        const decoded = verifyRefreshToken(incomingToken);
        await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
      } catch (err) {}
    } else if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    }

    res.clearCookie(REFRESH_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe
};
