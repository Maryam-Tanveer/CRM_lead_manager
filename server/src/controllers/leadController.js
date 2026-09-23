const Lead = require('../models/Lead');
const { VALID_STATUSES, LEAD_STATUS } = require('../constants/leadStatus');
const { ROLES } = require('../constants/roles');

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const ALLOWED_SORT_FIELDS = ['createdAt', 'name', 'email', 'status', 'assignedTo'];

const createLead = async (req, res, next) => {
  try {
    const { name, email, phone, status, assignedTo } = req.body;

    const existingLead = await Lead.findOne({ email: email.toLowerCase().trim() });
    if (existingLead) {
      return res.status(409).json({
        success: false,
        message: 'A lead with this email address already exists'
      });
    }

    const lead = new Lead({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      status: status || LEAD_STATUS.NEW,
      assignedTo: assignedTo && assignedTo.trim() !== '' ? assignedTo.trim() : 'Unassigned',
      createdBy: req.user ? req.user._id : null
    });

    const savedLead = await lead.save();

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: savedLead
    });
  } catch (error) {
    next(error);
  }
};

const getLeads = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const { search, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = {};

    if (status && status !== 'all' && VALID_STATUSES.includes(status)) {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      const sanitized = escapeRegex(search.trim());
      const searchRegex = new RegExp(sanitized, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { assignedTo: searchRegex }
      ];
    }

    const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
    const sortOptions = {
      [safeSortBy]: sortOrder === 'asc' ? 1 : -1
    };

    const [leads, total] = await Promise.all([
      Lead.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
      Lead.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      success: true,
      data: {
        leads,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead status updated successfully',
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

const updateLead = async (req, res, next) => {
  try {
    const { name, email, phone, status, assignedTo } = req.body;

    if (email) {
      const existingLead = await Lead.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: req.params.id }
      });

      if (existingLead) {
        return res.status(409).json({
          success: false,
          message: 'Another lead with this email address already exists'
        });
      }
    }

    const updateFields = {};
    if (name) updateFields.name = name.trim();
    if (email) updateFields.email = email.toLowerCase().trim();
    if (phone) updateFields.phone = phone.trim();
    if (status) updateFields.status = status;
    if (assignedTo !== undefined) {
      updateFields.assignedTo = assignedTo.trim() !== '' ? assignedTo.trim() : 'Unassigned';
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    if (req.user.role !== ROLES.ADMIN) {
      if (!lead.createdBy || lead.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You are only authorized to delete your own leads'
        });
      }
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const [total, byStatus, recentLeads] = await Promise.all([
      Lead.countDocuments(),
      Lead.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      Lead.find().sort({ createdAt: -1 }).limit(5).lean()
    ]);

    const statusCounts = {
      [LEAD_STATUS.NEW]: 0,
      [LEAD_STATUS.CONTACTED]: 0,
      [LEAD_STATUS.CONVERTED]: 0
    };

    byStatus.forEach((item) => {
      if (item._id in statusCounts) {
        statusCounts[item._id] = item.count;
      }
    });

    const converted = statusCounts[LEAD_STATUS.CONVERTED];
    const conversionRate = total > 0 ? Number(((converted / total) * 100).toFixed(1)) : 0;

    res.status(200).json({
      success: true,
      data: {
        total,
        statusCounts,
        conversionRate,
        recentLeads
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus,
  updateLead,
  deleteLead,
  getAnalytics
};
