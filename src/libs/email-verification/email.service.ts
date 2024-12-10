import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendVerificationEmail(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: email,
      subject: 'Email Verification',
      text: `Your verification code is: ${code}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}