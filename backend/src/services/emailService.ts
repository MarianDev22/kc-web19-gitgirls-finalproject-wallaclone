import nodemailer from 'nodemailer';

class EmailService {
  private transporter;
  private mailHost = process.env.MAIL_HOST;
  private mailPort = process.env.MAIL_PORT;
  private mailUser = process.env.MAIL_USER;
  private mailPassword = process.env.MAIL_PASSWORD;
  private mailFrom = process.env.MAIL_FROM;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: this.MAILTRAP_HOST,
      port: Number(this.MAILTRAP_PORT),
      auth: {
        user: this.MAILTRAP_USERNAME,
        pass: this.MAILTRAP_PASSWORD,
      },
    });
  }

  async sendContactEmail({
    sellerEmail,
    buyerEmail,
    buyerUsername,
    advertName,
    message,
    advertLink
  }: {
    sellerEmail: string;
    buyerEmail: string;
    buyerUsername: string;
    advertName: string;
    message: string;
    advertLink:string
  }): Promise<void> {
    await this.transporter.sendMail({
      from: `"${buyerUsername} a través de Wallaclone-GitGirls" <${this.MAILTRAP_FROM}>`,
      to: sellerEmail,
      subject: `Alguien se ha interesado en tu anuncio: ${advertName}`,
      text: message,
      html: `
      <h3>Has recibido un nuevo mensaje</h3> 
      <p><strong>Usuario:</strong> ${buyerUsername}</p>
      <p><strong>Anuncio:</strong> ${advertName}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${message}</p>
      <p><strong>Ver anuncio:</strong>${advertLink}</p>
      <h4><i>Para contactar con el comprador responde directamente a este correo.</h4></i>`,
      replyTo: buyerEmail,
    });
  }
}

export const emailService = new EmailService();
