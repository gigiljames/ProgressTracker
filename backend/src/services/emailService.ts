import nodemailer from 'nodemailer';
import { IOtpEmailTemplate } from '../interfaces/IOtpEmailTemplate';
import { otpMailHtml } from '../constants/otpMailHtml';

export class EmailService {
  private _transporter: nodemailer.Transporter;
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });
  }
  async sendOtp(template: IOtpEmailTemplate): Promise<void> {
    const html = otpMailHtml(template.name, template.otp, template.body ?? '');
    const verify = await this._transporter.verify();
    if (!verify) {
      throw new Error('Error verifying nodemail transporter.');
    }
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.NODEMAILER_USER,
      to: template.email,
      subject: template.subject,
      html,
    };
    await this._transporter.sendMail(mailOptions);
  }
}
