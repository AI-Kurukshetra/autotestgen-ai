import { NextResponse } from "next/server";

import { getContactEmail, getSmtpConfig } from "@/lib/env";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
      reason?: string;
    };

    const name = body.name?.trim() || "";
    const email = body.email?.trim() || "";
    const subject = body.subject?.trim() || "";
    const message = body.message?.trim() || "";
    const reason = body.reason?.trim() || "general";

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Name, email, subject, and message are required." },
        { status: 400 }
      );
    }

    const smtp = getSmtpConfig();
    const contactEmail = getContactEmail();

    if (!smtp.enabled) {
      return NextResponse.json(
        {
          error:
            "Contact email is not configured yet. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM in the server environment."
        },
        { status: 500 }
      );
    }

    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth: {
        user: smtp.user,
        pass: smtp.pass
      }
    });

    await transporter.sendMail({
      from: smtp.from,
      to: contactEmail,
      replyTo: email,
      subject: `[AutoTestGen AI Contact] ${subject}`,
      text: [
        `Reason: ${reason}`,
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        message
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
          <h2>AutoTestGen AI contact request</h2>
          <p><strong>Reason:</strong> ${escapeHtml(reason)}</p>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
        </div>
      `
    });

    return NextResponse.json({
      message: "Your message has been sent to the admin team."
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unexpected contact failure."
      },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
