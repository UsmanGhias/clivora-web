/**
 * Persistent Campaign State & Anti-Spam Quota Tracker
 * Ensures strict enforcement of 95 emails/day Hostinger limit and zero duplicates.
 */

const fs = require('fs');
const path = require('path');

const TRACKER_FILE = path.join(__dirname, '../data/outreach_tracker.json');
const MAX_DAILY_QUOTA = 95;

function loadState() {
  if (!fs.existsSync(TRACKER_FILE)) {
    const initialState = {
      createdAt: new Date().toISOString(),
      dailyLogs: {},
      sentLeads: {},
      totalSent: 0,
      totalFailed: 0,
    };
    saveState(initialState);
    return initialState;
  }
  try {
    return JSON.parse(fs.readFileSync(TRACKER_FILE, 'utf8'));
  } catch (e) {
    console.error('Error reading tracker file, re-initializing:', e.message);
    return { createdAt: new Date().toISOString(), dailyLogs: {}, sentLeads: {}, totalSent: 0, totalFailed: 0 };
  }
}

function saveState(state) {
  const dir = path.dirname(TRACKER_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(TRACKER_FILE, JSON.stringify(state, null, 2), 'utf8');
}

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function getTodaySentCount() {
  const state = loadState();
  const todayKey = getTodayKey();
  return state.dailyLogs[todayKey] ? state.dailyLogs[todayKey].length : 0;
}

function canSendToday() {
  return getTodaySentCount() < MAX_DAILY_QUOTA;
}

function getRemainingTodayQuota() {
  return Math.max(0, MAX_DAILY_QUOTA - getTodaySentCount());
}

function isLeadAlreadySent(email) {
  const state = loadState();
  return Boolean(state.sentLeads[email.toLowerCase().trim()]);
}

function recordSend(lead, result) {
  const state = loadState();
  const todayKey = getTodayKey();
  if (!state.dailyLogs[todayKey]) {
    state.dailyLogs[todayKey] = [];
  }

  const record = {
    email: lead.email.toLowerCase().trim(),
    name: lead.name,
    company: lead.company,
    segment: lead.segment,
    sentAt: new Date().toISOString(),
    status: result.success ? 'SENT' : 'FAILED',
    messageId: result.messageId || null,
    error: result.error || null,
  };

  state.dailyLogs[todayKey].push(record);
  if (result.success) {
    state.sentLeads[record.email] = record;
    state.totalSent = (state.totalSent || 0) + 1;
  } else {
    state.totalFailed = (state.totalFailed || 0) + 1;
  }

  saveState(state);
}

function getCampaignSummary() {
  const state = loadState();
  const todayKey = getTodayKey();
  const todayCount = state.dailyLogs[todayKey] ? state.dailyLogs[todayKey].length : 0;

  return {
    todayKey,
    todaySent: todayCount,
    todayRemaining: Math.max(0, MAX_DAILY_QUOTA - todayCount),
    maxDailyQuota: MAX_DAILY_QUOTA,
    totalSentLifetime: state.totalSent || 0,
    totalFailedLifetime: state.totalFailed || 0,
    activeDays: Object.keys(state.dailyLogs).length,
  };
}

module.exports = {
  MAX_DAILY_QUOTA,
  loadState,
  saveState,
  getTodaySentCount,
  canSendToday,
  getRemainingTodayQuota,
  isLeadAlreadySent,
  recordSend,
  getCampaignSummary,
};
