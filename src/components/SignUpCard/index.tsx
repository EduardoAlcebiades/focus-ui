import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { FormControlLabel, MenuItem, Switch, TextField } from "@mui/material";
import { FiArrowLeft, FiLogIn } from "react-icons/fi";

import { IExperience } from "../../models/IExperience";
import { Button } from "../Button";
import { ISignUpData } from "../../services/AuthService";
import { AuthContext } from "../../context/AuthContext";
import ExperienceService from "../../services/ExperienceService";

import styles from "./styles.module.scss";

export const SignUpCard: React.FC = () => {
  const { signUp, signOut, phoneNumber, needSignUp, phoneNumberMask } =
    useContext(AuthContext);

  const [experiences, setExperiences] = useState<IExperience[]>([]);

  const [form, setForm] = useState<ISignUpData>({} as ISignUpData);

  async function refreshExperiences() {
    const response = await ExperienceService.index();

    setExperiences(response.data);
  }

  const handleInputChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const name = ev.target.name as keyof ISignUpData;
      let { value } = ev.target;

      if (name === "phone_number") value = phoneNumberMask(value);

      setForm((prev) => ({ ...prev, [name]: value }));
    },
    [phoneNumberMask]
  );

  const refresh = useCallback(async () => {
    await refreshExperiences();
  }, []);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      phone_number: phoneNumberMask(phoneNumber),
    }));
  }, [phoneNumber, phoneNumberMask]);

  useEffect(() => {
    if (needSignUp) refresh();
  }, [refresh, needSignUp]);

  return (
    <>
      {!needSignUp ? (
        false
      ) : (
        <div className={styles.container}>
          <h3 className={styles.title}>Cadastrar-se</h3>

          <form
            className={styles.form}
            onSubmit={(ev) => {
              ev.preventDefault();

              signUp(form);
            }}
          >
            <div className={styles.line}>
              <TextField
                variant="outlined"
                label="Nome"
                name="first_name"
                value={form.first_name || ""}
                onChange={handleInputChange}
                required
                fullWidth
              />

              <TextField
                variant="outlined"
                label="Sobrenome"
                name="last_name"
                value={form.last_name || ""}
                onChange={handleInputChange}
                required
                fullWidth
              />
            </div>

            <TextField
              variant="outlined"
              label="N° Celular"
              name="phone_number"
              placeholder="(00) 00000-0000"
              value={form.phone_number || ""}
              onChange={handleInputChange}
              inputProps={{ inputMode: "numeric" }}
              required
              fullWidth
            />

            <div className={styles.line}>
              <TextField
                variant="standard"
                label="Seu nível de Experiência"
                name="experience_id"
                value={form.experience_id || ""}
                onChange={handleInputChange}
                select
                required
                fullWidth
              >
                <MenuItem value="">-</MenuItem>
                {experiences.map((experience) => (
                  <MenuItem key={experience.id} value={experience.id}>
                    {experience.name}
                  </MenuItem>
                ))}
              </TextField>

              <FormControlLabel
                control={<Switch />}
                name="is_instructor"
                checked={Boolean(form.is_trainer)}
                onChange={(ev, is_instructor) =>
                  setForm((prev) => ({ ...prev, is_trainer: is_instructor }))
                }
                label="Sou instrutor"
                style={{ flex: 0.5, minWidth: "fit-content" }}
              />
            </div>

            {form.is_trainer && (
              <TextField
                variant="outlined"
                margin="normal"
                label="Código de convite"
                placeholder="#"
                helperText="Seu código de convite para ser instrutor"
                name="invite_code"
                value={form.invite_code || ""}
                onChange={handleInputChange}
                type="number"
                autoComplete="off"
                required
                fullWidth
              />
            )}

            <div className={styles.buttonsGroup}>
              <Button
                title="Cadastrar"
                icon={<FiLogIn />}
                text="Cadastrar"
                background="#09d687"
                color="white"
                type="submit"
              />

              <Button
                title="Acessar sistema"
                icon={<FiArrowLeft />}
                text="Voltar"
                color="gray"
                type="button"
                onClick={signOut}
                outlined
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};
