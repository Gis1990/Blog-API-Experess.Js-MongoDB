import  nodemailer from 'nodemailer'
import {settings} from "../settings";
import {usersRepository} from "../repositories/users-repository";

export const emailController = {
  async sendEmail (email: string,confirmationCode: string) {
      const transport = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: "anton.pavlovskiy1990@gmail.com",
              pass: settings.MAIL_PASS,
          },
      });

      const info = await transport.sendMail({
          from: 'Anton Pavlovskiy',
          to: email,
          subject:"email confirmation",
          text: `https://somesite.com/confirm-email?code=${confirmationCode}`,
          html: `<a href="https://somesite.com/confirm-email?code=${confirmationCode}"</a>`
      });
      await usersRepository.addEmailLog(email)
      return true
  }
}
