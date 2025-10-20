import {injectable} from '@loopback/core';
import nodemailer from 'nodemailer';

@injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendMailWithAttachment(
    to: string,
    subject: string,
    text: string,
    pdfBuffer: Buffer,
  ): Promise<void> {
    const mailOptions = {
      from: `"Falla Sants Patrons" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      attachments: [
        {
          filename: 'rebut.pdf',
          content: pdfBuffer,
        },
      ],
    };

    const info = await this.transporter.sendMail(mailOptions);
  }
}
