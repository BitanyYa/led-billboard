import { Resend } from "resend";
import type { ContactFormData } from "@/types/contact";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = "AWLO Advertising <onboarding@resend.dev>";
const AWLO_EMAIL   = process.env.CONTACT_RECEIVER_EMAIL ?? "awloadvertising@gmail.com";
const SITE_URL     = process.env.NEXT_PUBLIC_SITE_URL    ?? "http://localhost:3000";

// ─────────────────────────────────────────────
//  Confirmation email → customer
// ─────────────────────────────────────────────
export async function sendConfirmationEmail(data: ContactFormData): Promise<void> {
  await resend.emails.send({
    from: FROM_ADDRESS,
    to:   data.email,
    subject: `We received your message — AWLO Advertising`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Message Received</title>
</head>
<body style="margin:0;padding:0;background:#EEF4FF;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:20px;overflow:hidden;
                 box-shadow:0 4px 24px rgba(0,87,217,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0057D9,#1E73FF);
                        padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;
                          font-weight:800;letter-spacing:-0.5px;">
                AWLO Advertising
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">
                Premium LED Billboard Advertising · Ethiopia
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 8px;font-size:15px;color:#374151;font-weight:600;">
                Hello ${data.name},
              </p>
              <p style="margin:0 0 24px;font-size:14px;color:#6B7280;line-height:1.7;">
                Thank you for reaching out to us. We have received your message and
                our team will get back to you within <strong style="color:#0057D9;">24 hours</strong>
                on business days.
              </p>

              <!-- Message summary card -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#F0F7FF;border-radius:12px;border:1px solid #DBEAFE;
                        margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px;font-size:11px;font-weight:700;
                                color:#0057D9;text-transform:uppercase;letter-spacing:1px;">
                      Your Message Summary
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#6B7280;width:80px;">Subject</td>
                        <td style="padding:4px 0;font-size:13px;color:#111827;font-weight:600;">
                          ${data.subject}
                        </td>
                      </tr>
                      ${data.phone ? `
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#6B7280;">Phone</td>
                        <td style="padding:4px 0;font-size:13px;color:#111827;font-weight:600;">
                          ${data.phone}
                        </td>
                      </tr>` : ""}
                      <tr>
                        <td style="padding:8px 0 4px;font-size:13px;color:#6B7280;
                                    vertical-align:top;">Message</td>
                        <td style="padding:8px 0 4px;font-size:13px;color:#374151;
                                    line-height:1.6;">
                          ${data.message.replace(/\n/g, "<br/>")}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px;font-size:14px;color:#6B7280;line-height:1.7;">
                While you wait, feel free to browse our advertising packages or
                reach us directly via:
              </p>

              <!-- Contact options -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding-right:12px;">
                    <a href="tel:+251959155555"
                      style="display:inline-block;background:#0057D9;color:#ffffff;
                              font-size:13px;font-weight:700;padding:10px 20px;
                              border-radius:50px;text-decoration:none;">
                      📞 Call Us
                    </a>
                  </td>
                  <td style="padding-right:12px;">
                    <a href="https://wa.me/251959155555"
                      style="display:inline-block;background:#25D366;color:#ffffff;
                              font-size:13px;font-weight:700;padding:10px 20px;
                              border-radius:50px;text-decoration:none;">
                      💬 WhatsApp
                    </a>
                  </td>
                  <td>
                    <a href="${SITE_URL}/#packages"
                      style="display:inline-block;background:#FFD400;color:#111827;
                              font-size:13px;font-weight:700;padding:10px 20px;
                              border-radius:50px;text-decoration:none;">
                      📋 Packages
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F8FAFC;padding:24px 40px;
                        border-top:1px solid #E5E7EB;">
              <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center;
                          line-height:1.6;">
                AWLO Advertising · Awlo Business Center, Bole, Addis Ababa, Ethiopia<br/>
                <a href="mailto:awloadvertising@gmail.com"
                  style="color:#0057D9;text-decoration:none;">
                  awloadvertising@gmail.com
                </a>
                &nbsp;·&nbsp;
                <a href="tel:+251959155555" style="color:#0057D9;text-decoration:none;">
                  +251 959 15 55 55
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}

// ─────────────────────────────────────────────
//  Notification email → AWLO team
// ─────────────────────────────────────────────
export async function sendNotificationEmail(
  data: ContactFormData,
  recordId: string
): Promise<void> {
  const submittedAt = new Date().toLocaleString("en-ET", {
    timeZone: "Africa/Addis_Ababa",
    dateStyle: "full",
    timeStyle: "short",
  });

  await resend.emails.send({
    from: FROM_ADDRESS,
    to:   AWLO_EMAIL,
    replyTo: data.email,
    subject: `📩 New Contact: ${data.subject} — from ${data.name}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#0A1628;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#0D1F3C;border-radius:20px;overflow:hidden;
                 border:1px solid rgba(255,255,255,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#0057D9;padding:28px 36px;">
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.6);
                          letter-spacing:2px;text-transform:uppercase;font-weight:700;">
                New Contact Message
              </p>
              <h2 style="margin:6px 0 0;color:#ffffff;font-size:22px;font-weight:800;">
                ${data.subject}
              </h2>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 36px;">

              <!-- Sender details -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:rgba(255,255,255,0.04);border-radius:12px;
                        border:1px solid rgba(255,255,255,0.08);margin-bottom:24px;">
                <tr><td style="padding:20px 24px;">
                  <p style="margin:0 0 14px;font-size:11px;font-weight:700;
                              color:#60A5FA;text-transform:uppercase;letter-spacing:1px;">
                    Sender Details
                  </p>
                  ${[
                    ["Name",    data.name],
                    ["Email",   `<a href="mailto:${data.email}" style="color:#60A5FA;">${data.email}</a>`],
                    ["Phone",   data.phone ? `<a href="tel:${data.phone}" style="color:#60A5FA;">${data.phone}</a>` : "—"],
                    ["Submitted", submittedAt],
                    ["Record ID", `<code style="font-size:11px;color:#9CA3AF;">${recordId}</code>`],
                  ].map(([label, val]) => `
                    <table width="100%" cellpadding="0" cellspacing="4">
                      <tr>
                        <td style="width:90px;font-size:12px;color:#9CA3AF;padding:3px 0;">${label}</td>
                        <td style="font-size:13px;color:#F9FAFB;font-weight:600;padding:3px 0;">${val}</td>
                      </tr>
                    </table>`).join("")}
                </td></tr>
              </table>

              <!-- Message -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:rgba(255,255,255,0.04);border-radius:12px;
                        border:1px solid rgba(255,255,255,0.08);margin-bottom:28px;">
                <tr><td style="padding:20px 24px;">
                  <p style="margin:0 0 12px;font-size:11px;font-weight:700;
                              color:#60A5FA;text-transform:uppercase;letter-spacing:1px;">
                    Message
                  </p>
                  <p style="margin:0;font-size:14px;color:#D1D5DB;line-height:1.75;
                              white-space:pre-wrap;">
                    ${data.message.replace(/\n/g, "<br/>")}
                  </p>
                </td></tr>
              </table>

              <!-- Quick actions -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:10px;">
                    <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}"
                      style="display:inline-block;background:#0057D9;color:#ffffff;
                              font-size:13px;font-weight:700;padding:10px 20px;
                              border-radius:50px;text-decoration:none;">
                      ↩ Reply to ${data.name}
                    </a>
                  </td>
                  ${data.phone ? `
                  <td style="padding-right:10px;">
                    <a href="https://wa.me/${data.phone.replace(/\D/g, "")}"
                      style="display:inline-block;background:#25D366;color:#ffffff;
                              font-size:13px;font-weight:700;padding:10px 20px;
                              border-radius:50px;text-decoration:none;">
                      WhatsApp
                    </a>
                  </td>` : ""}
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;font-size:11px;color:#4B5563;text-align:center;">
                This notification was sent automatically by the AWLO Advertising website.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}
