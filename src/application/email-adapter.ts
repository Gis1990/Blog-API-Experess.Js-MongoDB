import  nodemailer from 'nodemailer'
import {settings} from '../settings'

export class EmailAdapter {
  constructor() {}
  async sendEmailWithRegistration (email: string, confirmationCode: string) {
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
    async sendEmailWithPasswordRecovery (email: string, passwordRecoveryCode: string) {
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
            subject:"Password recovery",
            text: `https://somesite.com/password-recovery?recoveryCode=${passwordRecoveryCode}`,
        });
        return true
    }
}


