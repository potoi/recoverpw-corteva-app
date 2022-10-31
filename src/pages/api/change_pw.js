import { Client } from "pg";
import sgMail from "@sendgrid/mail";
import { validateToken } from "../../_lib/JWT";
import crypto from "crypto";

export default async function handler(req, res) {
  console.log("enttrei aqui");
  if (req.method !== "POST") {
    return res.status(500).send();
  }

  try {
    const { token, pw } = req.body;

    console.log(token, pw);
    
    console.log('1');
    if (!token || !pw) {
      return res.status(500).send();
    }
    
    console.log('2');
    const vldToken = validateToken(token);
    if (!vldToken) {
      return res.status(500).send();
    }
    
    console.log('3');
    const newPW = crypto.createHmac("sha1", process.env.PG_SECRET);
    newPW.update(pw);
    const pwHashed = newPW.digest("hex");
    console.log('4');
    
    const client = new Client({
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      database: process.env.PG_DATABASE,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
    });

    await client.connect();
    const result = await client.query(
      `UPDATE login SET senha='${pwHashed}' WHERE colaboradoremail=LOWER('${vldToken.email}')`
      );
      await client.end();
      console.log('5');
      
    if (result?.rowCount <= 0) {
      console.log(result?.rowCount);
      return res.status(400).send();
    }
  } catch (error) {
    console.log({ error });
    return res.status(500).send();
  }
  return res.status(200).send();
}
