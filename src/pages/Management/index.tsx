import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GiStrong, GiWeight } from "react-icons/gi";
import { BiCategoryAlt } from "react-icons/bi";
import { BsBarChartLineFill } from "react-icons/bs";
import { FiHash, FiLogOut, FiRepeat } from "react-icons/fi";
import { Snackbar } from "@mui/material";
import { IoIosCopy } from "react-icons/io";
import { Route, Switch, NavLink, Redirect } from "react-router-dom";

import { TrainingPanel } from "../../components/TrainingPanel";
import { ExercisePanel } from "../../components/ExercisePanel";
import { CategoryPanel } from "../../components/CategoryPanel";
import { ExperiencePanel } from "../../components/ExperiencePanel";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import { AuthContext } from "../../context/AuthContext";
import UserService from "../../services/UserService";

import styles from "./styles.module.scss";

interface IRoute {
  name: string;
  path: string;
  element: React.FC;
  icon: React.ReactNode;
}

const routes: IRoute[] = [
  {
    name: "Treinos",
    path: "training",
    element: TrainingPanel,
    icon: <FiRepeat />,
  },
  {
    name: "Exercícios",
    path: "exercises",
    element: ExercisePanel,
    icon: <GiStrong />,
  },
  {
    name: "Categorias",
    path: "categories",
    element: CategoryPanel,
    icon: <BiCategoryAlt />,
  },
  {
    name: "Experiências",
    path: "experiences",
    element: ExperiencePanel,
    icon: <BsBarChartLineFill />,
  },
];

export const Management: React.FC = () => {
  const codeRef = useRef<HTMLSpanElement>(null);

  const { signOut } = useContext(AuthContext);

  const [modalIsOpened, setModalIsOpened] = useState(false);
  const [snackbarIsOpened, setSnackbarIsOpened] = useState(false);

  const [inviteCode, setInviteCode] = useState<string | null>(null);

  function handleCopyText() {
    if (!codeRef.current) return;

    const $temp = document.createElement("input");

    document.body.append($temp);

    $temp.value = codeRef.current.innerText;
    $temp.select();

    document.execCommand("copy");

    $temp.remove();

    setSnackbarIsOpened(true);
  }

  async function generateInviteCode() {
    const response = await UserService.generateInviteCode();

    setInviteCode(response.data.toString());
  }

  const refreshInviteCode = useCallback(() => {
    generateInviteCode().catch((err) => {
      if (err.response?.status === 401)
        alert("Você não tem permissão para gerar um código");

      alert("Ocorreu um erro ao gerar um código");
    });
  }, []);

  useEffect(() => {
    if (modalIsOpened) refreshInviteCode();
    else setInviteCode(null);
  }, [modalIsOpened, refreshInviteCode]);

  return (
    <div className={styles.container}>
      <Modal
        title="Código de Convite"
        opened={modalIsOpened}
        onClose={() => setModalIsOpened(false)}
      >
        <div className={styles.modalContainer}>
          <p className={styles.title}>Aqui está seu código de convite!</p>
          <p className={styles.messageInfo}>
            Compartilhe com um amigo para ele poder se cadastrar como
            instrutor...
          </p>

          {inviteCode && (
            <button className={styles.inviteCode} onClick={handleCopyText}>
              <span className={styles.hash}>#</span>
              <span ref={codeRef}>{inviteCode}</span>
            </button>
          )}
        </div>
      </Modal>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarIsOpened}
        onClose={() => setSnackbarIsOpened(false)}
        autoHideDuration={2000}
        message={
          <span className={styles.spanMessage}>
            <IoIosCopy /> Código copiado para área de trasferência
          </span>
        }
      />

      <header className={styles.header}>
        <div className={styles.buttonsGroup}>
          <Button
            className={styles.navigate}
            title="Gerar código de convite"
            icon={<FiHash />}
            color="#17aaee"
            outlined
            onClick={() => setModalIsOpened(true)}
          />

          <NavLink to="/training" className={styles.navigate} title="Treinar">
            <GiWeight />
          </NavLink>

          <Button
            className={styles.navigate}
            title="Sair"
            icon={<FiLogOut />}
            color="#eb326a"
            background="#eb326a"
            onClick={signOut}
            outlined
          />
        </div>

        <nav className={styles.navGroup}>
          {routes.map((route) => (
            <NavLink
              key={route.name}
              activeClassName={styles.active}
              to={`/management/${route.path}`}
            >
              {route.icon} <span>{route.name}</span>
            </NavLink>
          ))}
        </nav>
      </header>

      <Switch>
        {routes.map((route) => (
          <Route
            key={route.name}
            path={`/management/${route.path}`}
            component={route.element}
            exact
          />
        ))}

        <Redirect to={`/management/${routes[0]?.path || ""}`} />
      </Switch>
    </div>
  );
};
