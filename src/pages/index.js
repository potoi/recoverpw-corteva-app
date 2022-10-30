// import Head from "next/head";
// import Image from "next/image";
// import styles from "../styles/Home.module.css";
// import { useRouter } from "next/router";
// import axios from "../services/api";

// export default function Home() {
//   const router = useRouter();
//   const { token } = router.query;

//   return (
//     <div className={styles.container}>
//       <Head></Head>
//     </div>
//   );
// }

// export const getServerSideProps = async ({ req, params }) => {
//   try {
//     axios.get("/send_email");
//     // axios.get(`send_email/${params.token}`);
//   } catch (error) {
//     console.error({ error });
//   }
//   return { props: {} };
// };

import React from 'react'

export default function index() {
  return (
    <div>[token]</div>
  )
}
