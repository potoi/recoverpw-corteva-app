import pg from "pg";

let pgClient;

export default async function Conexao() {
  try {
    if (pgClient) {
      console.log("Socket reaproveitado!");
      return pgClient;
    }

    pgClient = new pg.Client({
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      database: process.env.PG_DATABASE,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
    });

    return new Promise(
      async (resolve, reject) => {
        await pgClient.connect((err) => !err && console.log("Conectado ao bd com sucesso!"));
      },
      (err, info) => {
        err ? reject(err) : resolve(info);
      }
    );
  } catch (error) {
    console.error(error);
  }
}
