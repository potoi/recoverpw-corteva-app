import { sendEmail } from "./_lib/nodemailer";
import pgDB from "./_lib/PGUtil";
import { createTokens } from "./_lib/JWT";

export default function handler(req, res) {
  console.log(req.query.email);

  try {
    if (!req.method === "GET") {
      return res.status(400).json({ message: "Method not allowed!" });
    }

    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Bad email!" });
    }

    pgDB().query(
      `SELECT id FROM login WHERE LOWER(colaboradoremail)=LOWER('${email}') LIMIT 1`,
      (err, result) => {
        if (err) {
          console.error({ error: err });
          return res.status(500).json({ message: "Internal Error" });
        }
        if (result.rowCount > 0) {
          const token = createTokens(email);
          sendEmail({ destine: email, token });
        }
      }
    );
    return res.status(200).send();
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}
