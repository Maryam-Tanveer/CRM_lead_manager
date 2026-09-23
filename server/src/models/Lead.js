const mongoose = require('mongoose');
const { LEAD_STATUS, VALID_STATUSES } = require('../constants/leadStatus');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address']
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: VALID_STATUSES,
      default: LEAD_STATUS.NEW,
      index: true
    },
    assignedTo: {
      type: String,
      default: 'Unassigned',
      trim: true,
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

leadSchema.index({ name: 'text', email: 'text', phone: 'text', assignedTo: 'text' });

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
