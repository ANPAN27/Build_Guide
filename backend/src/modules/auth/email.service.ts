import nodemailer from "nodemailer";
import { env } from "../../config/env.js";
import { logger } from "../../lib/logger.js";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!env.SMTP_HOST) return null;
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  });
  return transporter;
}

async function sendMail(to: string, subject: string, text: string) {
  const tx = getTransporter();
  if (!tx) {
    logger.info({ to, subject }, "Email delivery not configured; logging email action only");
    return;
  }
  await tx.sendMail({ from: env.SMTP_FROM, to, subject, text });
}

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const url = `${env.APP_BASE_URL}/verify-email?token=${encodeURIComponent(token)}`;
  await sendMail(email, "Verify your Build Guide email", `Hi ${name},\n\nVerify your email by opening: ${url}\n\nThis link expires in 24 hours.`);
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const url = `${env.APP_BASE_URL}/reset-password?token=${encodeURIComponent(token)}`;
  await sendMail(email, "Reset your Build Guide password", `Hi ${name},\n\nReset your password by opening: ${url}\n\nThis link expires in 1 hour. If you did not request this, ignore this email.`);
}
