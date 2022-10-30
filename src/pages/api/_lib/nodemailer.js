import nodemailer from "nodemailer";
import emailContent from "./emailMaker";

let transporter;

export async function sendEmail({ destine, token }) {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PW,
      },
    });
  }
  const link = `${process.env.APP_LINK}/recover/${token}`;

  transporter.sendMail(
    {
      from: process.env.SMTP_USER,
      to: destine,
      subject: "Corteva app, recuperação de senha",
      html: emailContent(link),
    },
    (err, info) => {
      if (err) console.log(err);
      else console.log(info);
    }
  );
}
