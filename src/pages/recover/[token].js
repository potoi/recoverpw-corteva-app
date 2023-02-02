import { validateToken } from "../../_lib/JWT";
import styles from "./styles.module.css";
import PwInput from "../../components/PwInput";
import ButtonForm from "../../components/ButtonForm";
import bg from "../../../public/background.svg";
import Head from "next/head";
import { useState } from "react";
import axios from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Recover({ jwt }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [firstpw, setFirstpw] = useState("");
  const [secondpw, setSecondpw] = useState("");

  function handleSubmit(evt) {
    try {
      evt.preventDefault();
      if (firstpw.length < 6) {
        toast.error("Senha muito curta!");
        return;
      }

      if (firstpw !== secondpw) {
        toast.error("Senhas não coincidem!");
        return;
      }

      const url = process.env.API_URL;
      axios
        .post(
          url,
          {
            email: jwt.jwtObject.email,
            pw: firstpw,
          },
          { headers: { Authorization: jwt.token } }
        )
        .then(({ status }) => {
          if (status !== 200) {
            toast.error("Erro ao mudar senha, tente novamente mais tarde.");
            return;
          }
          setIsSuccess(true);
        });
    } catch (err) {
      toast.error("ERROR: " + JSON.stringify(err));
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <link rel="shortcut icon" href={bg.src} type="img/png" />
      </Head>
      <ToastContainer theme={"colored"} hideProgressBar={true} />
      <img
        src="https://soudealgodao.com.br/wp-content/uploads/2020/08/logo-apoiador-corteva.png"
        alt="corteva logo"
      />
      {isSuccess && (
        <h1 style={{ color: "green" }}>Senha trocada com sucesso!</h1>
      )}
      {jwt?.token && !isSuccess && (
        <>
          <h1>Redefinição de Senha</h1>
          <form onSubmit={handleSubmit}>
            <PwInput
              text="Digite a senha"
              value={firstpw}
              setState={setFirstpw}
            />
            <PwInput
              text="Repita a senha"
              value={secondpw}
              setState={setSecondpw}
            />
            <ButtonForm text={"REDEFINIR SENHA"} />
          </form>
        </>
      )}
      {!jwt?.token && !isSuccess && <h1>Link Inválido!</h1>}
      <p>Corteva 2022.</p>
      <img src={bg.src} className={styles.bg} alt="texto do rodape" />
    </div>
  );
}

export const getServerSideProps = async ({ req, params }) => {
  try {
    const { token } = params;

    const jwtObject = validateToken(token);

    if (!jwtObject) return { props: {} };

    return {
      props: {
        jwt: {
          token,
          jwtObject,
        },
      },
    };
  } catch (error) {
    console.error({ error });
  }
  return { props: {} };
};
