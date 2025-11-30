import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {
    const smtpConfig = this.configService.get('app.email.transport');
    this.transporter = nodemailer.createTransport(smtpConfig);
    
    // Verify connection config
    if (this.configService.get('app.env') !== 'test') {
      this.transporter
        .verify()
        .then(() => this.logger.log('Connected to email server'))
        .catch((error) =>
          this.logger.warn(
            'Unable to connect to email server. Check SMTP configuration.',
            error,
          ),
        );
    }
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const from = this.configService.get('app.email.from');
    const msg = { from, to, subject, text };
    await this.transporter.sendMail(msg);
  }

  async sendResetPasswordEmail(to: string, token: string): Promise<void> {
    const subject = 'Reset password';
    // Replace with your frontend URL
    const resetPasswordUrl = `http://localhost:3000/v1/auth/reset-password?token=${token}`;
    const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
    
    await this.sendEmail(to, subject, text);
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const subject = 'Email Verification';
    // Replace with your frontend URL
    const verificationEmailUrl = `http://localhost:3000/v1/auth/verify-email?token=${token}`;
    const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;

    await this.sendEmail(to, subject, text);
  }
}