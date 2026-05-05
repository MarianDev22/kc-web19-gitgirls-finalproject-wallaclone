import nodemailer, { type Transporter } from 'nodemailer';

type SendContactEmailParams = {
  sellerEmail: string;
  buyerEmail: string;
  buyerUsername: string;
  advertName: string;
  message: string;
  advertLink: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

class EmailService {
  private transporter: Transporter;
  private mailFrom = process.env.MAIL_FROM ?? 'wallaclone.demo@gmail.com';

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT ?? 587),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendContactEmail({
    sellerEmail,
    buyerEmail,
    buyerUsername,
    advertName,
    message,
    advertLink,
  }: SendContactEmailParams): Promise<void> {
    const subject = `${buyerUsername} tiene una duda sobre ${advertName}`;
    const replySubject = `Re: ${advertName} en Wallaclone`;
    const replyBody = `Hola ${buyerUsername},

    Gracias por escribir sobre "${advertName}".

    `;
    const replyLink = `mailto:${buyerEmail}?subject=${encodeURIComponent(
      replySubject,
    )}&body=${encodeURIComponent(replyBody)}`;

    await this.transporter.sendMail({
      from: `"Wallaclone GitGirls" <${this.mailFrom}>`,
      to: sellerEmail,
      subject,
      text: `
${buyerUsername} tiene una duda sobre ${advertName}. ¡Ayúdale!

Has recibido un nuevo mensaje en Wallaclone.

Persona interesada: ${buyerUsername}
Anuncio: ${advertName}

Mensaje:
${message}

Puedes responder directamente a este correo o escribirle desde aquí:
${buyerEmail}

Ver anuncio:
${advertLink}

Equipo Wallaclone
`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.5;">
          <h2 style="color: #111827; margin-bottom: 16px;">
            ${escapeHtml(buyerUsername)} tiene una duda sobre ${escapeHtml(advertName)}. ¡Ayúdale!
          </h2>

          <p>
            Has recibido un nuevo mensaje en <strong>Wallaclone</strong>.
          </p>

          <p>
            <strong>Persona interesada:</strong> ${escapeHtml(buyerUsername)}<br />
            <strong>Anuncio:</strong> ${escapeHtml(advertName)}
          </p>

          <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin-top: 0;"><strong>Mensaje:</strong></p>
            <p style="margin-bottom: 0;">${escapeHtml(message)}</p>
          </div>

          <p>
            Puedes responder directamente a este correo o usar este botón:
          </p>

          <p>
            <a
              href="${escapeHtml(replyLink)}"
              style="display: inline-block; background-color: #00bba7; color: #ffffff; text-decoration: none; padding: 12px 18px; border-radius: 8px; font-weight: bold;"
            >
              Contéstale aquí
            </a>
          </p>

          <p>
            También puedes ver el anuncio aquí:<br />
            <a href="${escapeHtml(advertLink)}">${escapeHtml(advertLink)}</a>
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

          <p style="font-size: 13px; color: #6b7280;">
            Este email se ha enviado automáticamente desde Wallaclone.
          </p>
        </div>
      `,
      replyTo: buyerEmail,
    });
  }
}

export const emailService = new EmailService();
