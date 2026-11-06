import { Resend } from 'resend';
import { site } from './site';

export interface OutgoingEmail {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export type SendEmail = (email: OutgoingEmail) => Promise<void>;

const INK = '#211e1a';
const MUTED = '#66625a';
const ACCENT = '#175e54';
const PAPER = '#faf8f4';

function layout(title: string, body: string, unsubscribeUrl: string): string {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background:${PAPER};font-family:'Public Sans',Segoe UI,system-ui,sans-serif;color:${INK};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
        <tr><td style="padding-bottom:24px;border-bottom:1px solid #e3dfd4;">
          <span style="font-size:20px;font-weight:600;letter-spacing:-0.01em;">Glance</span>
        </td></tr>
        <tr><td style="padding:28px 0 8px;font-size:17px;line-height:1.55;color:${INK};">${body}</td></tr>
        <tr><td style="padding-top:28px;border-top:1px solid #e3dfd4;font-size:12px;line-height:1.6;color:${MUTED};">
          Glance is free, open source software for Windows 11. You are receiving this because you joined the release list at ${site.name}.<br>
          <a href="${unsubscribeUrl}" style="color:${ACCENT};">Unsubscribe in one click</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function confirmationEmail(to: string, confirmUrl: string, unsubscribeUrl: string): OutgoingEmail {
  const body = `You asked to hear when the first Glance build ships.<br><br>
Confirm your address and we will email you once, when there is something to install:<br><br>
<a href="${confirmUrl}" style="display:inline-block;background:${ACCENT};color:#ffffff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:999px;">Confirm my address</a><br><br>
<span style="font-size:13px;color:${MUTED};">If the button does not work, paste this link into your browser:<br>${confirmUrl}</span><br><br>
Glance is not released yet. There is no download until the first build exists.`;
  const text = `You asked to hear when the first Glance build ships.

Confirm your address and we will email you once, when there is something to install:

${confirmUrl}

Glance is not released yet. There is no download until the first build exists.

Unsubscribe in one click: ${unsubscribeUrl}`;
  return { to, subject: 'Confirm your address for the Glance release list', text, html: layout('Confirm your address', body, unsubscribeUrl) };
}

export function welcomeEmail(to: string, unsubscribeUrl: string): OutgoingEmail {
  const body = `You are on the release list.<br><br>
We will email you when the first Glance build is ready to install. Until then, the most reliable place to watch is the GitHub repository:<br><br>
<a href="${site.github}" style="color:${ACCENT};font-weight:600;">github.com/sarang-cmd/glance</a><br><br>
Nothing else will land in your inbox from us. No newsletter, no promotions.`;
  const text = `You are on the release list.

We will email you when the first Glance build is ready to install. Until then, watch the GitHub repository:

${site.github}

Nothing else will land in your inbox from us. No newsletter, no promotions.

Unsubscribe in one click: ${unsubscribeUrl}`;
  return { to, subject: 'Welcome to the Glance release list', text, html: layout('Welcome to the Glance release list', body, unsubscribeUrl) };
}

/** Production sender. Throws a clear error when Resend is not configured. */
export function createResendSender(): SendEmail {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');
  const from = process.env.RESEND_FROM ?? 'Glance <onboarding@resend.dev>';
  const resend = new Resend(key);
  return async (email) => {
    const { error } = await resend.emails.send({ from, to: email.to, subject: email.subject, text: email.text, html: email.html });
    if (error) throw new Error(`Resend error: ${error.message}`);
  };
}
