import pgDB from "./_lib/PGUtil";
import { validateToken } from "./_lib/JWT";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(500).json({ message: "Method not allowed!" }).send();
  }

  const db = await pgDB();

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Bad Request!" }).send();
    }

    const vldToken = validateToken(token);

    if (!vldToken) {
      return res.status(500).json({ message: "Bad Token!" }).send();
    }

    const newPW = crypto.createHmac("sha1", process.env.PG_SECRET);
    newPW.update(req.body.pw);
    const pwHashed = newPW.digest("hex");

    await db.query(
      `UPDATE login SET senha='${pwHashed}' WHERE colaboradoremail=LOWER('${vldToken.email}')`,
      (err, result) => {
        if (err) {
          console.error({ error: err });
        }
      }
    );
    return res.status(200).send();
  } catch (error) {
    console.error({ error });
    return;
  }
}
