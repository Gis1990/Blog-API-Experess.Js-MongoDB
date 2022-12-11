import  nodemailer from 'nodemailer'
import {settings} from '../settings'

export class EmailAdapter {
  constructor() {}
  async sendEmail (email: string,confirmationCode: string) {
      const transport = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: "anton.pavlovskiy1990@gmail.com",
              pass: settings.mailPass,
          },
      });
      const info = await transport.sendMail({
          from: 'Anton Pavlovskiy',
          to: email,
          subject:"email confirmation",
          text: `https://somesite.com/confirm-email?code=${confirmationCode}`,
      });
      return true
  }
}


