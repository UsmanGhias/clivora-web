<?php
/**
 * CLIVORA & CODCRAFTERS 24/7 AUTONOMOUS CLOUD OUTREACH ENGINE
 * Runs continuously in Hostinger Cloud via Scheduled Cron.
 * Strictly adheres to max 95 emails/day quota and zero-spam guidelines.
 * Features: Clivora Business OS, CODCrafters Engineering, Usman Ghias.
 * (No em-dashes anywhere).
 */

ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

$SECURITY_KEY = "UsmanCareerBot2026";
$req_key = $_GET['key'] ?? ($_POST['key'] ?? '');
$test_to = $_GET['test_to'] ?? ($_POST['test_to'] ?? '');

$is_cli = (php_sapi_name() === 'cli');
// Every action that sends mail requires CLI (cron) or the security key.
$is_authorized = $is_cli || (is_string($req_key) && $req_key !== '' && hash_equals($SECURITY_KEY, $req_key));

// Hostinger MySQL Connection
$db_hosts = ['localhost', 'srv1415.hstgr.io', '127.0.0.1'];
$db_name = 'u275200862_jobs_db';
$db_user = 'u275200862_jobs_user';
$db_pass = 'UsmanJobs2026!#';

$pdo = null;
foreach ($db_hosts as $h) {
    try {
        $pdo = new PDO("mysql:host={$h};dbname={$db_name};charset=utf8mb4", $db_user, $db_pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 3
        ]);
        break;
    } catch (Exception $e) {}
}

if (!$pdo) {
    $sqlite_dir = __DIR__ . '/data';
    if (!is_dir($sqlite_dir)) mkdir($sqlite_dir, 0755, true);
    $pdo = new PDO("sqlite:" . $sqlite_dir . '/outreach_tracker.db');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}

// Ensure database table exists
$pdo->exec("CREATE TABLE IF NOT EXISTS clivora_outreach_leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(191) UNIQUE,
    name VARCHAR(255),
    company VARCHAR(255),
    role VARCHAR(255),
    segment VARCHAR(50),
    status VARCHAR(50) DEFAULT 'PENDING',
    sent_at DATETIME NULL,
    response_log TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

// Official Professional Clivora Hostinger Mailbox Senders
$CLIVORA_SENDERS = [
    [
        "smtp_host" => "ssl://smtp.hostinger.com",
        "smtp_port" => 465,
        "auth_user" => "growth@clivora.io",
        "auth_pass" => "46730820Hangb@?!;Usman",
        "from_email" => "growth@clivora.io",
        "from_name" => "Usman Ghias · Clivora & CODCrafters"
    ],
    [
        "smtp_host" => "ssl://smtp.hostinger.com",
        "smtp_port" => 465,
        "auth_user" => "hello@clivora.io",
        "auth_pass" => "46730820Hangb@?!;Usman",
        "from_email" => "hello@clivora.io",
        "from_name" => "Clivora Ecosystem"
    ],
    [
        "smtp_host" => "ssl://smtp.hostinger.com",
        "smtp_port" => 465,
        "auth_user" => "contact@clivora.io",
        "auth_pass" => "46730820Hangb@?!;Usman",
        "from_email" => "contact@clivora.io",
        "from_name" => "Usman Ghias · Principal Architect"
    ],
    [
        "smtp_host" => "ssl://smtp.hostinger.com",
        "smtp_port" => 465,
        "auth_user" => "marketing@clivora.io",
        "auth_pass" => "46730820Hangb@?!;Usman",
        "from_email" => "marketing@clivora.io",
        "from_name" => "Clivora Community & Growth"
    ],
    [
        "smtp_host" => "ssl://smtp.hostinger.com",
        "smtp_port" => 465,
        "auth_user" => "partners@clivora.io",
        "auth_pass" => "46730820Hangb@?!;Usman",
        "from_email" => "partners@clivora.io",
        "from_name" => "Clivora Strategic Partnerships"
    ],
    [
        "smtp_host" => "ssl://smtp.hostinger.com",
        "smtp_port" => 465,
        "auth_user" => "usmanghias@clivora.io",
        "auth_pass" => "46730820Hangb@?!;Usman",
        "from_email" => "usmanghias@clivora.io",
        "from_name" => "Usman Ghias (Founder)"
    ]
];

// Check Daily Quota (Max 95 sends per calendar day)
$MAX_DAILY_QUOTA = 95;
$stmt = $pdo->query("SELECT COUNT(*) FROM clivora_outreach_leads WHERE DATE(sent_at) = CURDATE() AND status = 'SENT'");
$today_sent = (int)$stmt->fetchColumn();
$total_sent_lifetime = (int)$pdo->query("SELECT COUNT(*) FROM clivora_outreach_leads WHERE status = 'SENT'")->fetchColumn();

// If accessed in browser without key or without cron trigger, show public status safely
if (!$is_authorized) {
    echo json_encode([
        "service" => "Clivora & CODCrafters Autonomous Cloud Outreach Engine",
        "status" => "running_in_cloud",
        "active_sender_domain" => "clivora.io (Official Hostinger TLS Mailbox)",
        "cron_schedule" => "Every 3 Hours (Autonomous Hostinger Cron)",
        "today_sent" => $today_sent,
        "max_daily_quota" => $MAX_DAILY_QUOTA,
        "today_remaining" => max(0, $MAX_DAILY_QUOTA - $today_sent),
        "total_sent_lifetime" => $total_sent_lifetime,
        "target_segments" => [
            "CLIENT: Hiring Companies, Agency Founders & CTOs (CODCrafters Software & Clivora OS)",
            "SPONSOR: Tech Partners, Accelerators & Summit 2026 Sponsors",
            "FREELANCER: Independent Developers & Consultants (Zero-Fee OS & 700+ Remote Jobs)"
        ],
        "note" => "Batch and test actions require the operator key."
    ], JSON_PRETTY_PRINT);
    exit;
}

// SMTP Dispatch Function via SSL/TLS Socket
function send_cloud_smtp($sender, $to, $subject, $html_body, $plain_text) {
    $host = $sender['smtp_host'] ?? 'ssl://smtp.hostinger.com';
    $port = $sender['smtp_port'] ?? 465;

    $socket = @fsockopen($host, $port, $errno, $errstr, 20);
    if (!$socket) throw new Exception("Could not connect to SMTP host: {$errstr} ({$errno})");

    $log = '';
    $read_reply = function($socket, &$log) {
        $data = '';
        while ($line = fgets($socket, 512)) {
            $data .= $line;
            if (substr($line, 3, 1) === ' ') break;
        }
        $log .= $data;
        return $data;
    };

    $send_cmd = function($socket, $cmd, &$log) use ($read_reply) {
        fputs($socket, $cmd . "\r\n");
        return $read_reply($socket, $log);
    };

    $read_reply($socket, $log);
    $send_cmd($socket, "EHLO clivora.io", $log);
    $send_cmd($socket, "AUTH LOGIN", $log);
    $send_cmd($socket, base64_encode($sender['auth_user']), $log);
    $auth_res = $send_cmd($socket, base64_encode($sender['auth_pass']), $log);

    if (strpos($auth_res, '235') === false) {
        fclose($socket);
        throw new Exception("SMTP Authentication failed: " . $auth_res);
    }

    $send_cmd($socket, "MAIL FROM:<{$sender['auth_user']}>", $log);
    $send_cmd($socket, "RCPT TO:<{$to}>", $log);
    $send_cmd($socket, "DATA", $log);

    $boundary = "bnd_" . md5(uniqid(time()));
    $headers = [
        "From: \"{$sender['from_name']}\" <{$sender['from_email']}>",
        "To: <{$to}>",
        "Subject: {$subject}",
        "Reply-To: <{$sender['from_email']}>",
        "MIME-Version: 1.0",
        "Content-Type: multipart/alternative; boundary=\"{$boundary}\"",
        "X-Mailer: Clivora Cloud Outreach Engine/2026",
        "List-Unsubscribe: <mailto:contact@clivora.io?subject=unsubscribe>"
    ];

    $email_raw = implode("\r\n", $headers) . "\r\n\r\n";
    $email_raw .= "--{$boundary}\r\n";
    $email_raw .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n";
    $email_raw .= $plain_text . "\r\n\r\n";
    $email_raw .= "--{$boundary}\r\n";
    $email_raw .= "Content-Type: text/html; charset=UTF-8\r\n\r\n";
    $email_raw .= $html_body . "\r\n\r\n";
    $email_raw .= "--{$boundary}--\r\n.\r\n";

    fputs($socket, $email_raw);
    $send_res = $read_reply($socket, $log);
    $send_cmd($socket, "QUIT", $log);
    fclose($socket);

    if (strpos($send_res, '250') === false) {
        throw new Exception("SMTP Data rejected: " . $send_res);
    }

    return true;
}

// Generate Personalized Pitch Content
function generate_outreach_email($lead) {
    $name = htmlspecialchars($lead['name']);
    $company = htmlspecialchars($lead['company']);

    if ($lead['segment'] === 'CLIENT') {
        $subject = "Scaling {$company} tech delivery (0% platform fees + enterprise engineering)";
        $plain = "Hi {$name},\n\nI came across your leadership at {$company} and wanted to reach out directly.\n\nI am Usman Ghias, Founder of CODCrafters and creator of Clivora (https://clivora.io) - an integrated operating system built to streamline how growing companies hire, manage, and invoice top-tier software talent.\n\nIf your team is scaling technical capabilities, we support businesses in two ways:\n1. Clivora Client Workspace: Hire and manage verified software talent with \$0 platform fees on contracts.\n2. CODCrafters Enterprise Services: Dedicated custom software development, Odoo 17/18 ERP implementations, and AI agent workflows.\n\nExplore our case study and service portfolio: https://community.clivora.io/start-a-project\n\nWould you be open to a brief 10-minute sync this week to explore alignment?\n\nBest regards,\nUsman Ghias\nFounder & Principal Architect, CODCrafters & Clivora\nhttps://clivora.io | contact@clivora.io";

        $html = "<div style='font-family: Arial, sans-serif; color: #1e293b; line-height: 1.6; max-width: 600px;'>
            <p>Hi <strong>{$name}</strong>,</p>
            <p>I came across your leadership at <strong>{$company}</strong> and wanted to reach out directly.</p>
            <p>I am Usman Ghias, Founder of <strong>CODCrafters</strong> and architect of <a href='https://clivora.io' target='_blank' style='color: #0d9488; font-weight: bold;'>Clivora</a>: a connected Freelancer & Client Business OS designed to eliminate fragmented tools and 20% marketplace commissions.</p>
            <div style='background: #f1f5f9; border-left: 4px solid #0d9488; padding: 14px 18px; margin: 20px 0;'>
                <strong>How We Support Growing Teams:</strong>
                <ul style='margin: 8px 0 0 0; padding-left: 20px; font-size: 14px;'>
                    <li><strong>Clivora Client Workspace:</strong> Direct developer hiring with \$0 platform fees on contracts.</li>
                    <li><strong>CODCrafters Engineering:</strong> Custom Next.js web applications, Odoo 17/18 ERP systems, and AI pipelines.</li>
                </ul>
            </div>
            <p><a href='https://community.clivora.io/start-a-project' style='background: #0d9488; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;'>Explore CODCrafters Services &rarr;</a></p>
            <p style='font-size: 13px; color: #64748b; margin-top: 30px;'>Best regards,<br><strong>Usman Ghias</strong><br>Founder & Principal Engineer, Clivora & CODCrafters<br><a href='https://clivora.io' style='color: #0d9488;'>clivora.io</a> | contact@clivora.io</p>
        </div>";
    } elseif ($lead['segment'] === 'SPONSOR') {
        $subject = "Partnership & Sponsorship with Clivora Community Ecosystem";
        $plain = "Hi {$name},\n\nI hope you are doing well.\n\nI am Usman Ghias, Founder of Clivora (https://clivora.io) and CODCrafters. We have built an integrated Freelancer OS and knowledge hub (https://community.clivora.io) serving independent developers and tech builders globally.\n\nWe are currently opening strategic sponsorship tracks for our Virtual Summit 2026, API developer directory spotlight, and agency referral network.\n\nExplore our partner tiers: https://community.clivora.io/partners\n\nWould you be open to a 10-minute chat next week?\n\nBest regards,\nUsman Ghias\nFounder, Clivora & CODCrafters\nhttps://community.clivora.io | contact@clivora.io";

        $html = "<div style='font-family: Arial, sans-serif; color: #1e293b; line-height: 1.6; max-width: 600px;'>
            <p>Hi <strong>{$name}</strong>,</p>
            <p>I am reaching out to explore strategic partnership and sponsorship alignment between <strong>{$company}</strong> and the <strong>Clivora Community Ecosystem</strong>.</p>
            <p><a href='https://clivora.io' target='_blank' style='color: #0d9488; font-weight: bold;'>Clivora</a> is a connected operating platform for independent developers, founders, and consultants worldwide.</p>
            <div style='background: #f1f5f9; border-left: 4px solid #0d9488; padding: 14px 18px; margin: 20px 0;'>
                <strong>Active Partnership Tracks:</strong>
                <ul style='margin: 8px 0 0 0; padding-left: 20px; font-size: 14px;'>
                    <li><strong>Virtual Summit 2026:</strong> Keynote, workshop, and brand placement.</li>
                    <li><strong>Developer Directory Spotlight:</strong> Feature your developer tools or APIs.</li>
                    <li><strong>Agency Referral Network:</strong> 15% recurring commissions for custom enterprise builds.</li>
                </ul>
            </div>
            <p><a href='https://community.clivora.io/partners' style='background: #0d9488; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;'>View Partner Tiers &rarr;</a></p>
            <p style='font-size: 13px; color: #64748b; margin-top: 30px;'>Best regards,<br><strong>Usman Ghias</strong><br>Founder, Clivora & CODCrafters<br><a href='https://community.clivora.io' style='color: #0d9488;'>community.clivora.io</a> | contact@clivora.io</p>
        </div>";
    } else {
        $subject = "Zero marketplace fees on your freelance contracts (Clivora OS)";
        $plain = "Hi {$name},\n\nIf you are managing independent client contracts, you know that traditional marketplaces take 10% to 20% of every deal.\n\nI built Clivora (https://clivora.io) to give freelancers their own operating system:\n- Browse 700+ verified remote jobs with direct hiring: https://clivora.io/jobs\n- \$0 platform fees on all contracts - clients pay you directly against your invoice\n- Integrated CRM, Kanban projects, time tracking, and professional PDF invoices\n- Cross-platform web + native Android app with offline-first synchronization\n\nOpen your free workspace: https://clivora.io/signup\n\nBest regards,\nUsman Ghias\nFounder, Clivora & CODCrafters\nhttps://clivora.io | hello@clivora.io";

        $html = "<div style='font-family: Arial, sans-serif; color: #1e293b; line-height: 1.6; max-width: 600px;'>
            <p>Hi <strong>{$name}</strong>,</p>
            <p>If you are managing independent client contracts, you know how frustrating it is when traditional marketplaces take 10% to 20% of your earnings.</p>
            <p>I created <a href='https://clivora.io' target='_blank' style='color: #0d9488; font-weight: bold;'>Clivora</a> to give independent professionals their own private operating system with <strong>\$0 platform fees</strong>.</p>
            <div style='background: #f1f5f9; border-left: 4px solid #0d9488; padding: 14px 18px; margin: 20px 0;'>
                <strong>Why Independent Pros Are Switching:</strong>
                <ul style='margin: 8px 0 0 0; padding-left: 20px; font-size: 14px;'>
                    <li><strong>\$0 Platform Fees:</strong> Settle deals directly with 100% earnings retained.</li>
                    <li><strong>700+ Remote Jobs:</strong> Real-time verified opportunities across tech and design.</li>
                    <li><strong>All-in-One Desk:</strong> CRM, milestone projects, timer, and branded PDF invoices.</li>
                </ul>
            </div>
            <p><a href='https://clivora.io/signup' style='background: #0d9488; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;'>Open Free Workspace &rarr;</a></p>
            <p style='font-size: 13px; color: #64748b; margin-top: 30px;'>Best regards,<br><strong>Usman Ghias</strong><br>Founder, Clivora & CODCrafters<br><a href='https://clivora.io' style='color: #0d9488;'>clivora.io</a> | hello@clivora.io</p>
        </div>";
    }

    return ["subject" => $subject, "plain" => $plain, "html" => $html];
}

// ─────────────────────────────────────────────────────────────────────────────
// Test Mode: Send live sample directly to requested email
// ─────────────────────────────────────────────────────────────────────────────
if (!empty($test_to)) {
    $sender = $CLIVORA_SENDERS[0];
    $test_lead = [
        "name" => "Usman Ghias",
        "company" => "CODCrafters & Clivora",
        "role" => "Founder & Principal Architect",
        "segment" => "CLIENT"
    ];
    $content = generate_outreach_email($test_lead);
    
    try {
        send_cloud_smtp($sender, $test_to, "[LIVE TEST] " . $content['subject'], $content['html'], $content['plain']);
        echo json_encode([
            "status" => "success",
            "message" => "Live test outreach email successfully dispatched to {$test_to} via Hostinger Cloud!",
            "from" => "{$sender['from_name']} <{$sender['from_email']}>",
            "subject" => "[LIVE TEST] " . $content['subject'],
            "timestamp" => date('Y-m-d H:i:s')
        ], JSON_PRETTY_PRINT);
    } catch (Exception $e) {
        echo json_encode([
            "status" => "error",
            "message" => "Failed to send test email: " . $e->getMessage()
        ], JSON_PRETTY_PRINT);
    }
    exit;
}

// ─────────────────────────────────────────────────────────────────────────────
// Normal Scheduled Cron Batch Processing
// ─────────────────────────────────────────────────────────────────────────────
if ($today_sent >= $MAX_DAILY_QUOTA) {
    echo json_encode([
        "status" => "capped",
        "message" => "Daily outreach quota of {$MAX_DAILY_QUOTA} emails reached for today.",
        "today_sent" => $today_sent,
        "max_quota" => $MAX_DAILY_QUOTA
    ]);
    exit;
}

// Determine batch size for this execution cycle
$batch_limit = min(8, $MAX_DAILY_QUOTA - $today_sent);
$stmt = $pdo->prepare("SELECT * FROM clivora_outreach_leads WHERE status = 'PENDING' ORDER BY id ASC LIMIT ?");
$stmt->bindValue(1, $batch_limit, PDO::PARAM_INT);
$stmt->execute();
$batch = $stmt->fetchAll();

if (empty($batch)) {
    echo json_encode([
        "status" => "idle",
        "message" => "All scheduled prospects in the campaign directory have already been contacted.",
        "today_sent" => $today_sent,
        "total_sent_lifetime" => $total_sent_lifetime
    ]);
    exit;
}

// Global Rule: Pre-Flight Email Syntax & MX Domain Verification
function verify_email_domain_mx($email, &$reason = "") {
    $email = trim($email);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $reason = "Invalid email syntax";
        return false;
    }
    
    $parts = explode('@', $email);
    $domain = end($parts);

    $fake_domains = ['example.com', 'test.com', 'localhost', 'invalid.com', 'tempmail.com'];
    if (in_array(strtolower($domain), $fake_domains, true)) {
        $reason = "Domain is blacklisted or placeholder: {$domain}";
        return false;
    }

    $mx_hosts = [];
    if (getmxrr($domain, $mx_hosts) && !empty($mx_hosts)) {
        return true;
    }

    if (checkdnsrr($domain, "MX")) {
        return true;
    }

    if (checkdnsrr($domain, "A")) {
        return true;
    }

    $reason = "Domain {$domain} has no active MX or A mail records";
    return false;
}

$processed = [];
$sender_idx = 0;

foreach ($batch as $lead) {
    // 1. Mandatory Pre-Flight MX Verification Rule
    $reject_reason = "";
    if (!verify_email_domain_mx($lead['email'], $reject_reason)) {
        $upd = $pdo->prepare("UPDATE clivora_outreach_leads SET status = 'REJECTED', response_log = ? WHERE id = ?");
        $upd->execute(["Pre-flight check rejected: {$reject_reason}", $lead['id']]);

        $processed[] = [
            "email" => $lead['email'],
            "name" => $lead['name'],
            "segment" => $lead['segment'],
            "status" => "REJECTED",
            "reason" => $reject_reason
        ];
        continue;
    }

    $sender = $CLIVORA_SENDERS[$sender_idx % count($CLIVORA_SENDERS)];
    $content = generate_outreach_email($lead);

    try {
        send_cloud_smtp($sender, $lead['email'], $content['subject'], $content['html'], $content['plain']);
        
        $upd = $pdo->prepare("UPDATE clivora_outreach_leads SET status = 'SENT', sent_at = NOW(), response_log = ? WHERE id = ?");
        $upd->execute(["Delivered via {$sender['from_email']} (Hostinger TLS SMTP)", $lead['id']]);

        $processed[] = [
            "email" => $lead['email'],
            "name" => $lead['name'],
            "segment" => $lead['segment'],
            "status" => "SENT",
            "from" => "{$sender['from_name']} <{$sender['from_email']}>"
        ];

        $today_sent++;
        $sender_idx++;

        if (count($batch) > 1) {
            sleep(rand(10, 15));
        }
    } catch (Exception $e) {
        $upd = $pdo->prepare("UPDATE clivora_outreach_leads SET status = 'FAILED', response_log = ? WHERE id = ?");
        $upd->execute([$e->getMessage(), $lead['id']]);

        $processed[] = [
            "email" => $lead['email'],
            "name" => $lead['name'],
            "segment" => $lead['segment'],
            "status" => "FAILED",
            "error" => $e->getMessage()
        ];
    }
}

echo json_encode([
    "status" => "success",
    "cycle_processed" => count($processed),
    "today_total_sent" => $today_sent,
    "max_daily_quota" => $MAX_DAILY_QUOTA,
    "batch_details" => $processed,
    "timestamp" => date('Y-m-d H:i:s')
]);
