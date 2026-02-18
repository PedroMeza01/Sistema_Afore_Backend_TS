import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true si usas 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const Mailer = {
  send: async (input: { to: string | string[]; subject: string; html: string }) => {
    return transporter.sendMail({
      from: `"CRM AFORE" <${process.env.SMTP_FROM}>`,
      to: input.to,
      subject: input.subject,
      html: input.html
    });
  }
};
