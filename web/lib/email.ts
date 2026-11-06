import { Resend } from "resend";
export function emailContent(
  kind: "confirm" | "welcome",
  url: string,
  unsubscribe: string,
) {
  const confirm = kind === "confirm";
  const title = confirm
    ? "Confirm your Glance release emails"
    : "You’re on the Glance release list";
  const body = confirm
    ? "Confirm your address to hear when the first Glance build ships. Glance is still in planning. This link expires in 24 hours."
    : "Your address is confirmed. You’ll hear when the first build ships. Glance is still in planning; there is no download yet.";
  const action = confirm ? "Confirm my email" : "Follow Glance on GitHub";
  return {
    subject: title,
    text: `${title}\n\n${body}\n\n${action}: ${url}\n\nIf you did not request this, you can ignore this email or unsubscribe: ${unsubscribe}\n\nGlance · Sarang Batra\nsarang.cmd@gmail.com`,
    html: `<!doctype html><html lang="en"><body style="margin:0;background:#f5f4ef;font-family:Arial,sans-serif;color:#202820;padding:32px"><div style="max-width:520px;margin:auto"><p style="color:#305b45;font-size:24px">◌ glance</p><h1 style="font-size:30px;font-weight:500">${title}</h1><p style="font-size:16px;line-height:1.7">${body}</p><p style="margin:32px 0"><a style="background:#305b45;color:#fff;padding:14px 20px;text-decoration:none" href="${url}">${action}</a></p><p style="font-size:12px;line-height:1.7">If you did not request this, ignore this email or <a href="${unsubscribe}" style="color:#305b45">unsubscribe</a>.</p><p style="font-size:12px">Glance · Sarang Batra<br/>sarang.cmd@gmail.com</p></div></body></html>`,
  };
}
export async function sendEmail(
  to: string,
  kind: "confirm" | "welcome",
  url: string,
  unsubscribe: string,
  id: string,
) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const result = await resend.emails.send(
    {
      from: process.env.RESEND_FROM_EMAIL!,
      to,
      replyTo: "sarang.cmd@gmail.com",
      ...emailContent(kind, url, unsubscribe),
      headers: {
        "List-Unsubscribe": `<${unsubscribe.replace("/unsubscribe?", "/api/unsubscribe?")}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    },
    { idempotencyKey: `${kind}-${id}` },
  );
  if (result.error) throw new Error("Email unavailable");
}
