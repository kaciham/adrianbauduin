import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

// POST /api/server
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let data: any = {};

    if (contentType.includes('application/json')) {
      data = await req.json();
    } else {
      // fallback: parse query string
      const url = new URL(req.url);
      data = Object.fromEntries(url.searchParams.entries());
    }

    const name = data.name || '';
    const email = data.email || '';
    const subject = data.subject || `Nouveau message de ${name || 'un visiteur'}`;
    const message = data.message || '';
    const phone = data.phone || '';
    const company = data.company || '';

    // transporter configuration from env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    });

    // Basic validation of required env vars to give clearer errors early
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      const missing = [] as string[];
      if (!process.env.SMTP_HOST) missing.push('SMTP_HOST');
      if (!process.env.SMTP_USER) missing.push('SMTP_USER');
      console.error('Missing SMTP environment variables:', missing.join(', '));
      return NextResponse.json({ success: false, error: `Missing env: ${missing.join(', ')}` }, { status: 500 });
    }

    // verify transporter connection before sending (helps catch auth/connectivity issues)
    try {
      await transporter.verify();
      console.log('SMTP transporter verified');
    } catch (verifyErr) {
      console.error('SMTP verification failed', verifyErr);
      return NextResponse.json({ success: false, error: `SMTP verification failed: ${String(verifyErr)}` }, { status: 500 });
    }

    const to= process.env.CONTACT_TO || '';
    const mailOptions = {
      from: process.env.SMTP_USER ? `${name} <${process.env.SMTP_USER}>` : `${name}`,
      to,
      subject,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Company:</strong> ${company}</p><hr/><p>${(message || '').replace(/\n/g, '<br/>')}</p>`,
    };

  // send mail
  const info = await transporter.sendMail(mailOptions as any);
  console.log('Email sent', { messageId: info.messageId, accepted: info.accepted, rejected: info.rejected });
  return NextResponse.json({ success: true, message: 'Email sent successfully', info: { messageId: info.messageId, accepted: info.accepted, rejected: info.rejected } });
  } catch (err) {
    console.error('Failed to send contact email', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
