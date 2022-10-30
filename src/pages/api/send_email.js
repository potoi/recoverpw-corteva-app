import { sendEmail } from "./_lib/nodemailer";
import pgDB from "./_lib/PGUtil";
import { createTokens } from "./_lib/JWT";

export default async function handler(req, res) {
  console.log(req.query.email);
  let isValid = false;
  let myError;

  const db = await pgDB();

  try {
    if (!req.method === "GET") {
      return res.status(400).json({ message: "Method not allowed!" });
    }

    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Bad email!" });
    }

    db.query(
      `SELECT id FROM login WHERE LOWER(colaboradoremail)=LOWER('${email}') LIMIT 1`,
      (err, result) => {
        if (err) {
          myError = err;
          return;
        }
        if (result.rowCount > 0) {
          isValid = true;
        }
      }
    );

    if (isValid) {
      const token = createTokens(email);
      sendEmail({ destine: email, token });
    } else {
      myError = "Internal error";
    }

    if (myError) return res.status(500).json({ message: myError });

    return res.status(200).send();
  } catch (error) {
    console.error({ error });
    return;
  }
}
