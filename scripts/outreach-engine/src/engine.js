#!/usr/bin/env node

/**
 * Clivora & CODCrafters Outreach Engine
 * Automated, High-Deliverability Cold Outreach via Hostinger TLS SMTP.
 * 
 * Usage:
 *   node src/engine.js --mode status
 *   node src/engine.js --mode dry-run
 *   node src/engine.js --mode test --to your@email.com
 *   node src/engine.js --mode run --day 1 --limit 95
 */

const path = require('path');
const fs = require('fs');
const { sendSmtpEmail, verifyEmailDomainMx } = require('./smtp_client');
const { renderClientPitch, renderSponsorPitch, renderFreelancerPitch } = require('./templates');
const { getDailyProspects, SEED_PROSPECTS } = require('./lead_generator');
const {
  canSendToday,
  getRemainingTodayQuota,
  isLeadAlreadySent,
  recordSend,
  getCampaignSummary,
} = require('./tracker');

// Load environment configuration
function getSmtpConfig() {
  return {
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    user: process.env.SMTP_USER || 'growth@clivora.io',
    pass: process.env.SMTP_PASS || '46730820Hangb@?!;Usman',
    from: process.env.SMTP_FROM || 'Usman Ghias · Clivora & CODCrafters <growth@clivora.io>',
  };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomDelay(minSec = 15, maxSec = 35) {
  const sec = Math.floor(Math.random() * (maxSec - minSec + 1)) + minSec;
  return sec * 1000;
}

function renderLeadEmail(lead) {
  if (lead.segment === 'CLIENT') {
    return renderClientPitch(lead);
  } else if (lead.segment === 'SPONSOR') {
    return renderSponsorPitch(lead);
  } else {
    return renderFreelancerPitch(lead);
  }
}

async function runStatus() {
  const summary = getCampaignSummary();
  console.log('\n=== CLIVORA & CODCRAFTERS OUTREACH ENGINE STATUS ===');
  console.log(`Date:                   ${summary.todayKey}`);
  console.log(`Today Sent:             ${summary.todaySent} / ${summary.maxDailyQuota}`);
  console.log(`Today Remaining Quota:  ${summary.todayRemaining} emails`);
  console.log(`Total Sent Lifetime:    ${summary.totalSentLifetime}`);
  console.log(`Total Failed Lifetime:  ${summary.totalFailedLifetime}`);
  console.log(`Active Campaign Days:   ${summary.activeDays}`);
  console.log('====================================================\n');
}

async function runDryRun() {
  console.log('\n=== CLIVORA OUTREACH DRY-RUN (SAMPLE RENDERS) ===\n');

  const sampleLeads = [
    { email: 'sarah@apexventures.com', name: 'Sarah Jenkins', company: 'Apex Ventures', role: 'Managing Director', segment: 'CLIENT' },
    { email: 'alex@cloudscale.io', name: 'Alex Vance', company: 'CloudScale Ecosystems', role: 'Head of Partnerships', segment: 'SPONSOR' },
    { email: 'dev@marcus.tech', name: 'Marcus Chen', company: 'Independent Consultant', skill: 'Full-Stack & Mobile Development', segment: 'FREELANCER' },
  ];

  for (const lead of sampleLeads) {
    console.log(`----------------------------------------------------------------`);
    console.log(`SEGMENT: ${lead.segment} | RECIPIENT: ${lead.name} (${lead.email})`);
    const rendered = renderLeadEmail(lead);
    console.log(`SUBJECT: ${rendered.subject}`);
    console.log(`\nPLAIN TEXT BODY PREVIEW:\n${rendered.text.slice(0, 300)}...\n`);
  }
  console.log('----------------------------------------------------------------');
  console.log('Dry-run complete. All 3 template segments verified.\n');
}

async function runTest(testEmail) {
  if (!testEmail) {
    console.error('Error: Please provide a valid recipient email with --to <email>');
    process.exit(1);
  }

  const config = getSmtpConfig();
  console.log(`\n=== SENDING TEST OUTREACH PACK TO: ${testEmail} ===`);
  console.log(`SMTP Host: ${config.host}:${config.port} | User: ${config.user}\n`);

  if (!config.pass) {
    console.log('NOTE: SMTP_PASS not found in environment. Testing SMTP connection...');
  }

  const testLead = {
    email: testEmail,
    name: 'Valued Partner',
    company: 'Innovate Tech Group',
    role: 'Managing Partner',
    segment: 'CLIENT',
  };

  const emailContent = renderLeadEmail(testLead);

  try {
    console.log(`Sending Segment A (Client & CODCrafters Services Pitch)...`);
    const res = await sendSmtpEmail(config, {
      to: testEmail,
      subject: `[TEST] ${emailContent.subject}`,
      text: emailContent.text,
      html: emailContent.html,
    });
    console.log(`Success! Message ID: ${res.messageId}`);
  } catch (err) {
    console.error(`Send Failed: ${err.message}`);
  }
}

async function runCampaign(options) {
  const { day = 1, limit = 95 } = options;
  const config = getSmtpConfig();

  console.log(`\n=== LAUNCHING OUTREACH BATCH (DAY ${day}) ===`);
  const summary = getCampaignSummary();
  console.log(`Daily Quota: ${summary.todaySent}/${summary.maxDailyQuota} already sent today.`);

  if (!canSendToday()) {
    console.log('Daily sending limit of 95 emails reached. Halting to preserve mailbox reputation.');
    return;
  }

  const allowedToSend = Math.min(limit, getRemainingTodayQuota());
  const { batch, totalAvailable } = getDailyProspects(day, allowedToSend);

  console.log(`Batch Queue: ${batch.length} leads loaded (Total available in directory: ${totalAvailable})`);
  console.log(`Applying anti-spam randomized human delay (15-35 seconds per email)...\n`);

  let sentCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < batch.length; i++) {
    const lead = batch[i];

    if (isLeadAlreadySent(lead.email)) {
      console.log(`[${i + 1}/${batch.length}] SKIP: ${lead.email} (Already contacted)`);
      skippedCount++;
      continue;
    }

    if (!canSendToday()) {
      console.log('Reached daily quota cap (95/day). Stopping batch for today.');
      break;
    }

    // 1. Mandatory Pre-Flight MX & Domain Verification Rule
    const mxCheck = await verifyEmailDomainMx(lead.email);
    if (!mxCheck.valid) {
      console.log(`[${i + 1}/${batch.length}] REJECTED: ${lead.email} - Reason: ${mxCheck.reason}`);
      recordSend(lead, { success: false, error: `Pre-flight MX verification failed: ${mxCheck.reason}` });
      skippedCount++;
      continue;
    }

    const emailContent = renderLeadEmail(lead);
    console.log(`[${i + 1}/${batch.length}] SENDING [${lead.segment}]: ${lead.name} <${lead.email}> - "${emailContent.subject}"`);

    try {
      const res = await sendSmtpEmail(config, {
        to: lead.email,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
      });

      recordSend(lead, { success: true, messageId: res.messageId });
      sentCount++;
      console.log(`  -> OK [Delivered via Hostinger TLS SMTP]`);

      if (i < batch.length - 1) {
        const delayMs = getRandomDelay(15, 30);
        console.log(`  -> Pausing for ${(delayMs / 1000).toFixed(0)}s before next contact...\n`);
        await sleep(delayMs);
      }
    } catch (err) {
      console.error(`  -> ERROR sending to ${lead.email}: ${err.message}`);
      recordSend(lead, { success: false, error: err.message });
    }
  }

  console.log(`\n=== BATCH SUMMARY ===`);
  console.log(`Sent: ${sentCount} | Skipped: ${skippedCount} | Total Processed: ${batch.length}`);
  console.log('=====================\n');
}

// CLI Argument Parsing
async function main() {
  const args = process.argv.slice(2);
  const modeIndex = args.indexOf('--mode');
  const mode = modeIndex !== -1 ? args[modeIndex + 1] : 'status';

  const toIndex = args.indexOf('--to');
  const toEmail = toIndex !== -1 ? args[toIndex + 1] : null;

  const dayIndex = args.indexOf('--day');
  const day = dayIndex !== -1 ? parseInt(args[dayIndex + 1], 10) : 1;

  const limitIndex = args.indexOf('--limit');
  const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1], 10) : 95;

  if (mode === 'status') {
    await runStatus();
  } else if (mode === 'dry-run') {
    await runDryRun();
  } else if (mode === 'test') {
    await runTest(toEmail);
  } else if (mode === 'run') {
    await runCampaign({ day, limit });
  } else {
    console.log(`Unknown mode: ${mode}. Available modes: status, dry-run, test, run`);
  }
}

main().catch(err => {
  console.error('Fatal Engine Error:', err.message);
  process.exit(1);
});
