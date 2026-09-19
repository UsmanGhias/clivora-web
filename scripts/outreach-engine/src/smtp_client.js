/**
 * Hostinger TLS SMTP Client for Clivora & CODCrafters Outreach Engine
 * Connects directly to smtp.hostinger.com:465 via TLS.
 */

const tls = require('tls');

function parseFrom(from) {
  const m = from.match(/^(.*?)\s*<([^>]+)>$/);
  if (m) return { name: m[1].trim().replace(/^"|"$/g, ''), email: m[2].trim() };
  return { name: 'Clivora and CODCrafters', email: from.trim() };
}

function dotStuff(body) {
  return body.replace(/\r\n/g, '\n').split('\n').map(line => (line.startsWith('.') ? '.' + line : line)).join('\r\n');
}

function buildMimeMessage(options) {
  const { from, to, subject, text, html, attachments = [] } = options;
  const fromParsed = parseFrom(from);
  const boundary = '----=_NextPart_' + Date.now().toString(16) + '_' + Math.random().toString(16).slice(2);
  const altBoundary = '----=_AltPart_' + Date.now().toString(16) + '_' + Math.random().toString(16).slice(2);
  const messageId = `<${Date.now()}.${Math.random().toString(36).slice(2)}@clivora.io>`;
  const dateStr = new Date().toUTCString();

  let headers = [
    `From: "${fromParsed.name}" <${fromParsed.email}>`,
    `To: <${to}>`,
    `Subject: ${subject}`,
    `Date: ${dateStr}`,
    `Message-ID: ${messageId}`,
    `MIME-Version: 1.0`,
    `X-Mailer: Clivora Business Engine/1.0`,
    `List-Unsubscribe: <mailto:contact@clivora.io?subject=unsubscribe>`,
    `Precedence: bulk`,
  ];

  let mimeBody = '';

  if (attachments.length > 0) {
    headers.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
    
    mimeBody += `--${boundary}\r\n`;
    mimeBody += `Content-Type: multipart/alternative; boundary="${altBoundary}"\r\n\r\n`;
    
    mimeBody += `--${altBoundary}\r\n`;
    mimeBody += `Content-Type: text/plain; charset=utf-8\r\n`;
    mimeBody += `Content-Transfer-Encoding: 8bit\r\n\r\n`;
    mimeBody += `${text || ''}\r\n\r\n`;
    
    mimeBody += `--${altBoundary}\r\n`;
    mimeBody += `Content-Type: text/html; charset=utf-8\r\n`;
    mimeBody += `Content-Transfer-Encoding: 8bit\r\n\r\n`;
    mimeBody += `${html || text || ''}\r\n\r\n`;
    mimeBody += `--${altBoundary}--\r\n\r\n`;

    for (const att of attachments) {
      mimeBody += `--${boundary}\r\n`;
      mimeBody += `Content-Type: ${att.contentType || 'application/octet-stream'}; name="${att.filename}"\r\n`;
      mimeBody += `Content-Transfer-Encoding: base64\r\n`;
      mimeBody += `Content-Disposition: attachment; filename="${att.filename}"\r\n\r\n`;
      mimeBody += `${att.contentBase64.match(/.{1,76}/g).join('\r\n')}\r\n\r\n`;
    }
    
    mimeBody += `--${boundary}--\r\n`;
  } else {
    headers.push(`Content-Type: multipart/alternative; boundary="${altBoundary}"`);
    
    mimeBody += `--${altBoundary}\r\n`;
    mimeBody += `Content-Type: text/plain; charset=utf-8\r\n`;
    mimeBody += `Content-Transfer-Encoding: 8bit\r\n\r\n`;
    mimeBody += `${text || ''}\r\n\r\n`;
    
    mimeBody += `--${altBoundary}\r\n`;
    mimeBody += `Content-Type: text/html; charset=utf-8\r\n`;
    mimeBody += `Content-Transfer-Encoding: 8bit\r\n\r\n`;
    mimeBody += `${html || text || ''}\r\n\r\n`;
    mimeBody += `--${altBoundary}--\r\n`;
  }

  return headers.join('\r\n') + '\r\n\r\n' + dotStuff(mimeBody);
}

function sendSmtpEmail(config, mailOptions) {
  return new Promise((resolve, reject) => {
    const { host = 'smtp.hostinger.com', port = 465, user, pass } = config;
    if (!user || !pass) {
      return reject(new Error('SMTP_USER and SMTP_PASS are required'));
    }

    const fromParsed = parseFrom(mailOptions.from || user);
    const toEmail = mailOptions.to.trim();
    const rawMime = buildMimeMessage({
      ...mailOptions,
      from: mailOptions.from || `Usman Ghias (CODCrafters) <${user}>`,
    });

    const socket = tls.connect({
      host,
      port,
      rejectUnauthorized: true,
      servername: host,
    }, () => {
      // Connected
    });

    let buffer = '';
    let step = 'GREETING';

    function send(cmd) {
      socket.write(cmd + '\r\n');
    }

    socket.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split('\r\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line) continue;
        const code = line.slice(0, 3);
        const isLast = line.charAt(3) === ' ';

        if (!isLast) continue;

        if (step === 'GREETING' && code === '220') {
          step = 'EHLO';
          send('EHLO clivora.io');
        } else if (step === 'EHLO' && code === '250') {
          step = 'AUTH_LOGIN';
          send('AUTH LOGIN');
        } else if (step === 'AUTH_LOGIN' && code === '334') {
          step = 'AUTH_USER';
          send(Buffer.from(user).toString('base64'));
        } else if (step === 'AUTH_USER' && code === '334') {
          step = 'AUTH_PASS';
          send(Buffer.from(pass).toString('base64'));
        } else if (step === 'AUTH_PASS' && code === '235') {
          step = 'MAIL_FROM';
          send(`MAIL FROM:<${fromParsed.email}>`);
        } else if (step === 'MAIL_FROM' && code === '250') {
          step = 'RCPT_TO';
          send(`RCPT TO:<${toEmail}>`);
        } else if (step === 'RCPT_TO' && code === '250') {
          step = 'DATA';
          send('DATA');
        } else if (step === 'DATA' && code === '354') {
          step = 'SEND_BODY';
          socket.write(rawMime + '\r\n.\r\n');
        } else if (step === 'SEND_BODY' && code === '250') {
          step = 'QUIT';
          send('QUIT');
        } else if (step === 'QUIT' && (code === '221' || code === '250')) {
          socket.end();
          resolve({ success: true, messageId: line });
        } else {
          if (parseInt(code, 10) >= 400) {
            socket.destroy();
            return reject(new Error(`SMTP Error at step ${step}: ${line}`));
          }
        }
      }
    });

    socket.on('error', (err) => {
      reject(err);
    });

    socket.on('end', () => {
      if (step !== 'QUIT' && step !== 'SEND_BODY') {
        reject(new Error(`SMTP connection ended unexpectedly at step ${step}`));
      }
    });

    socket.setTimeout(30000, () => {
      socket.destroy();
      reject(new Error('SMTP connection timed out after 30 seconds'));
    });
  });
}

async function verifyEmailDomainMx(email) {
  const dns = require('dns').promises;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, reason: 'Invalid email syntax' };
  }
  const domain = email.split('@')[1].trim();
  const fakeDomains = ['example.com', 'test.com', 'localhost', 'invalid.com', 'tempmail.com'];
  if (fakeDomains.includes(domain.toLowerCase())) {
    return { valid: false, reason: `Domain is blacklisted or placeholder: ${domain}` };
  }
  try {
    const mxRecords = await dns.resolveMx(domain);
    if (mxRecords && mxRecords.length > 0) {
      return { valid: true, mx: mxRecords[0].exchange };
    }
  } catch (err) {
    try {
      const aRecords = await dns.resolve4(domain);
      if (aRecords && aRecords.length > 0) {
        return { valid: true, a: aRecords[0] };
      }
    } catch (aErr) {}
    return { valid: false, reason: `No MX or A records found for domain ${domain}` };
  }
  return { valid: false, reason: `Domain ${domain} has no valid MX records` };
}

module.exports = {
  sendSmtpEmail,
  buildMimeMessage,
  verifyEmailDomainMx,
};
