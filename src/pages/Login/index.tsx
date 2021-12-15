import { useContext, useEffect } from "react";
import { SignInCard } from "../../components/SignInCard";
import { SignUpCard } from "../../components/SignUpCard";
import { AuthContext } from "../../context/AuthContext";

import styles from "./styles.module.scss";

export const Login: React.FC = () => {
  const { signOut } = useContext(AuthContext);

  useEffect(() => {
    signOut();
  }, [signOut]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Bem vindo ao Focus</h2>
        <p className={styles.subTitle}>
          Preencha os dados para podermos começar...
        </p>
      </header>

      <SignInCard />
      <SignUpCard />
    </div>
  );
};
