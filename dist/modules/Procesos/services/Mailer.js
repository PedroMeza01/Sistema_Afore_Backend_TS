"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mailer = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true si usas 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
exports.Mailer = {
    send: async (input) => {
        return transporter.sendMail({
            from: `"CRM Saher" <${process.env.SMTP_FROM}>`,
            to: input.to,
            subject: input.subject,
            html: input.html
        });
    }
};
//# sourceMappingURL=Mailer.js.map