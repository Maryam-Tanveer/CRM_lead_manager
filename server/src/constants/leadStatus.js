const LEAD_STATUS = Object.freeze({
  NEW: 'new',
  CONTACTED: 'contacted',
  CONVERTED: 'converted'
});

const VALID_STATUSES = Object.values(LEAD_STATUS);

module.exports = {
  LEAD_STATUS,
  VALID_STATUSES
};
