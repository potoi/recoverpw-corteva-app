import { Client } from "pg";
import sgMail from "@sendgrid/mail";
import emailBuildText from "../../_lib/emailMaker";
import { createTokens } from "../../_lib/JWT";

export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(500).send();
  }

  const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
  });

  await client.connect();
  const result = await client.query(
    `SELECT id FROM login WHERE LOWER(colaboradoremail)=LOWER('${email}') LIMIT 1`
  );
  await client.end();

  if (result.rowCount == 0) return res.status(200).send();

  sgMail.setApiKey(JSON.parse(process.env.SEND_GRID_API).key);

  const token = createTokens(email);

  if (!token) return res.status(500).send();

  // const algo = await sgMail.send({
  //   to: "christopher.lee2011@hotmail.com",
  //   from: "appatividades@ehelpeducacao.com.br",
  //   subject: "Recuperação de senha",
  //   text: "link para redefinição",
  //   // html: emailBuildText(`${process.env.APP_LINK}/recover/${token}`),
  //   html: "<a>Teste</a>",
  // });

  console.log(JSON.parse(process.env.SEND_GRID_API).key);
  console.log(process.env.EMAIL_USER);
  console.log(token);
  console.log(email);

  const algo = await sgMail.send({
    to: email,
    from: process.env.EMAIL_USER,
    subject: "Recuperação de senha",
    text: "link para redefinição",
    html: emailBuildText(`${process.env.APP_LINK}/recover/${token}`),
    // html: "<b>CARALHOOOOOO QUERO MORRER!</b>",
  });

  console.log("enviei o email");
  console.log(algo);

  return res.status(200).send();
}
