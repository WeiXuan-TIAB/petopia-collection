import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER, // 你的 Gmail
    pass: process.env.MAIL_PASS, // Google 兩步驟驗證 → App Password
  },
})
