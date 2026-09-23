const express = require('express');
const {
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus,
  updateLead,
  deleteLead,
  getAnalytics
} = require('../controllers/leadController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createLeadSchema,
  updateLeadStatusSchema,
  updateLeadSchema
} = require('../validations/leadValidation');

const router = express.Router();

router.use(authenticate);

router.get('/analytics', getAnalytics);
router.post('/', validate(createLeadSchema), createLead);
router.get('/', getLeads);
router.get('/:id', getLeadById);
router.patch('/:id/status', validate(updateLeadStatusSchema), updateLeadStatus);
router.put('/:id', validate(updateLeadSchema), updateLead);
router.delete('/:id', deleteLead);

module.exports = router;
