import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { TextField } from "@mui/material";
import { FiLogIn } from "react-icons/fi";

import { Button } from "../Button";
import { AuthContext } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";

import styles from "./styles.module.scss";

export const SignInCard: React.FC = () => {
  const history = useHistory();

  const {
    signIn,
    phoneNumber: contextPhoneNumber,
    needSignUp,
    phoneNumberMask,
  } = useContext(AuthContext);

  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handleSubmit = useCallback(
    (ev: React.FormEvent) => {
      ev.preventDefault();

      signIn(phoneNumber, () => history.push("/training"));
    },
    [signIn, phoneNumber, history]
  );

  const handleInputChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = phoneNumberMask(ev.target.value.trim());

      setPhoneNumber(value);
    },
    [phoneNumberMask]
  );

  useEffect(() => {
    setPhoneNumber(phoneNumberMask(contextPhoneNumber));
  }, [contextPhoneNumber, phoneNumberMask]);

  return (
    <>
      {needSignUp ? (
        false
      ) : (
        <div className={styles.container}>
          <h3 className={styles.title}>Login</h3>

          <form className={styles.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              label="N° Celular"
              name="phone_number"
              placeholder="(00) 00000-0000"
              helperText="Em caso problemas no login, contate um administrador"
              value={phoneNumber}
              onChange={handleInputChange}
              inputProps={{ inputMode: "numeric" }}
              required
              fullWidth
            />

            <Button
              title="Acessar sistema"
              icon={<FiLogIn />}
              text="Acessar"
              background="#09d687"
              color="white"
              type="submit"
              disabled={!phoneNumber}
            />
          </form>
        </div>
      )}
    </>
  );
};
