import nodemailer, { type Transporter } from "nodemailer";

import { env } from "../../../config/env";

interface SendVerificationEmailInput {
  email: string;
  firstName: string;
  token: string;
}

export class EmailService {
  private readonly transporter: Transporter | null;

  constructor() {
    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASSWORD) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_SECURE,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASSWORD,
        },
      });
    } else {
      this.transporter = null;
    }
  }

  public async sendVerificationEmail(
    input: SendVerificationEmailInput,
  ): Promise<void> {
    const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${encodeURIComponent(
      input.token,
    )}`;

    if (!this.transporter) {
      console.log("Development verification email");
      console.log(`Recipient: ${input.email}`);
      console.log(`Verification URL: ${verificationUrl}`);
      console.log(`Verification token: ${input.token}`);

      return;
    }

    await this.transporter.sendMail({
      from: env.EMAIL_FROM,
      to: input.email,
      subject: "Verify your AutoLease email address",
      text: [
        `Hello ${input.firstName},`,
        "",
        "Verify your AutoLease account using the link below:",
        verificationUrl,
        "",
        `This link expires in ${env.EMAIL_VERIFICATION_EXPIRES_MINUTES} minutes.`,
      ].join("\n"),
      html: `
        <h2>Welcome to AutoLease</h2>
        <p>Hello ${input.firstName},</p>
        <p>Please verify your email address to activate your account.</p>
        <p>
          <a href="${verificationUrl}">
            Verify email address
          </a>
        </p>
        <p>
          This link expires in
          ${env.EMAIL_VERIFICATION_EXPIRES_MINUTES} minutes.
        </p>
      `,
    });
  }
}

export const emailService = new EmailService();
