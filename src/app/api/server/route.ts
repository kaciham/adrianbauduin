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
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9;">
            <table style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border: 1px solid #e0e0e0;">
                <tr>
                    <td>
                        <h2 style="color: #0073e6;">Nouveau message de contact</h2>
                        <p style="font-size: 16px; color: #555;">
                            Vous avez reçu un nouveau message depuis votre site web.
                        </p>
                        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #0073e6; margin: 20px 0;">
                            <p style="margin: 5px 0;"><strong>Nom:</strong> ${name}</p>
                            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                            <p style="margin: 5px 0;"><strong>Téléphone:</strong> ${phone}</p>
                            <p style="margin: 5px 0;"><strong>Entreprise:</strong> ${company}</p>
                        </div>
                        <h3 style="color: #333; margin-top: 25px;">Message:</h3>
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
                            <p style="font-size: 16px; color: #333; line-height: 1.6;">${(message || '').replace(/\n/g, '<br/>')}</p>
                        </div>
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                        <p style="font-size: 12px; color: #999;">Ce message a été envoyé depuis le formulaire de contact de votre site web.</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
      `,
    };

  // send notification email to admin
  const info = await transporter.sendMail(mailOptions as any);
  console.log('Notification email sent', { messageId: info.messageId, accepted: info.accepted, rejected: info.rejected });

  // send confirmation email to user if email is provided
  if (email) {
    const firstName = name.split(' ')[0] || name;
    const confirmationOptions = {
      from: process.env.SMTP_USER ? `Adrian Bauduin <${process.env.SMTP_USER}>` : 'Adrian Bauduin',
      to: email,
      subject: 'Confirmation de réception de votre message',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9;">
            <table style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border: 1px solid #e0e0e0;">
                <tr>
                    <td>
                        <h2 style="color: #0073e6;">Bonjour ${firstName},</h2>
                        <p style="font-size: 16px; color: #555;">
                            Un grand merci pour votre message. Je m’engage à prendre connaissance de votre projet au plus vite et je vous rappelle !
                        </p>
                        <p style="font-size: 16px; color: #333;">
                            Cordialement, <br> 
                            <strong>Adrian Bauduin</strong><br>
                            <span style="color: #666; font-size: 14px;">Créateur de trophées et objets personnalisés</span>
                        </p>
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                        <p style="font-size: 12px; color: #999;">Ceci est une réponse automatique. Merci de ne pas répondre à cet e-mail.</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
      `,
    };

    try {
      const confirmationInfo = await transporter.sendMail(confirmationOptions as any);
      console.log('Confirmation email sent', { messageId: confirmationInfo.messageId, accepted: confirmationInfo.accepted, rejected: confirmationInfo.rejected });
    } catch (confirmationErr) {
      console.error('Failed to send confirmation email', confirmationErr);
      // Don't fail the whole request if confirmation email fails
    }
  }

  return NextResponse.json({ 
    success: true, 
    message: 'Email sent successfully', 
    info: { 
      messageId: info.messageId, 
      accepted: info.accepted, 
      rejected: info.rejected,
      confirmationSent: !!email
    } 
  });
  } catch (err) {
    console.error('Failed to send contact email', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
