import { Client } from "pg";
import nodemailer from "nodemailer";


export default async function handler(req, res) {
  console.log(req.query.email);

  const { email } = req.query;

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

  if (result?.rows?.length <= 0) {
    return res.status(500).send();
  }

  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PW,
    },
  });

  let info = transporter.sendMail({
    from: `"Certamente não é aEHELP" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "algo",
    html: "<b>texto aleatorio aha</b>",
  });


  return res.status(200).send();
}

// db.connect((err) => !err && console.log("Conectado ao bd com sucesso!"));

// try {
//   if (!req.method === "GET") {
//     return res.status(400).json({ message: "Method not allowed!" });
//     console.log(myError);
//   }

//   const { email } = req.query;
//   if (!email) {
//     return res.status(400).json({ message: "Bad email!" });
//   }
//   console.log(myError);

//   await db.query(
//     `SELECT id FROM login WHERE LOWER(colaboradoremail)=LOWER('${email}') LIMIT 1`,
//     (err, result) => {
//       console.log("hoi");
//       if (err) {
//         console.log(err);
//         myError = err;
//         return;
//       }
//       console.log(result.rows);
//       if (result.rowCount > 0) {
//         isValid = true;
//       }
//     }
//   );

//   await db.end();

//   if (isValid) {
//     const token = createTokens(email);
//     sendEmail({ destine: email, token });
//   } else {
//     myError = "Internal error";
//   }
//   console.log(isValid);

//   if (myError) return res.status(500).json({ message: myError });

//   return res.status(200).send();
// } catch (error) {
//   console.error({ error });
//   return;
// }
