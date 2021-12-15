import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { TextField } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { GiUpgrade } from "react-icons/gi";
import { Button } from "../Button";
import { MessageInfo } from "../MessageInfo";

import { IExperience } from "../../models/IExperience";

import pannelStyles from "../../styles/pannelStyles.module.scss";
import ExperienceService, {
  IExperienceData,
} from "../../services/ExperienceService";

export const ExperiencePanel: React.FC = () => {
  const [experiences, setExperiences] = useState<IExperience[]>([]);

  const [form, setForm] = useState<IExperience | null>(null);
  const [formChanges, setFormChanges] = useState<object>({});

  async function refreshExperiences() {
    const response = await ExperienceService.index();

    setExperiences(response.data);
  }

  async function submit(data: IExperienceData, id?: string) {
    if (id) await ExperienceService.update(id, data);
    else await ExperienceService.store(data);
  }

  async function deleteItem(id: string) {
    await ExperienceService.delete(id);
  }

  const refresh = useCallback(async () => {
    await refreshExperiences();
  }, []);

  const handleInputChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = ev.target;

      setForm((prev) => prev && { ...prev, [name]: value });
      setFormChanges((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const discardChanges = useCallback(
    (options?: { hideAlert?: boolean }) => {
      const isNewForm = !form?.id;
      const hasChange = Boolean(
        (isNewForm && JSON.stringify(form) !== "{}") ||
          (!isNewForm && JSON.stringify(formChanges) !== "{}")
      );

      if (
        !options?.hideAlert &&
        form &&
        hasChange &&
        !window.confirm("Deseja descartar as alterações?")
      )
        return false;

      setForm(null);
      setFormChanges({});

      return true;
    },
    [form, formChanges]
  );

  const handleSubmit = useCallback(
    (ev: FormEvent) => {
      ev.preventDefault();

      if (!form) return;

      const { id, ...data } = form;

      submit(data, id)
        .then(() => {
          discardChanges({ hideAlert: true });

          refreshExperiences().catch(() =>
            alert("Ocorreu um erro ao carregar os dados")
          );
        })
        .catch((err) => {
          if (err.response?.status === 409) alert("Este item já existe");
          alert("Ocorreu um erro ao salvar os dados");
        });
    },
    [form, discardChanges]
  );

  const handleDeleteItem = useCallback(
    (experience: IExperience) => {
      if (window.confirm(`Deseja realmente excluir '${experience.name}'?`))
        deleteItem(experience.id)
          .then(() => {
            discardChanges({ hideAlert: true });

            refreshExperiences().catch(() =>
              alert("Ocorreu um erro ao carregar os dados")
            );
          })
          .catch(() => alert("Ocorreu um erro ao deletar o item"));
    },
    [discardChanges]
  );

  function startEdit(experience?: IExperience) {
    if (discardChanges()) setForm(experience || ({} as IExperience));
  }

  useEffect(() => {
    refresh().catch(() => alert("Ocorreu um erro ao carregar os dados"));
  }, [refresh]);

  return (
    <div className={pannelStyles.container}>
      {form && (
        <form className={pannelStyles.editForm} onSubmit={handleSubmit}>
          <div className={pannelStyles.line}>
            <TextField
              variant="standard"
              name="name"
              label="Nome"
              autoComplete="off"
              fullWidth
              required
              autoFocus
              value={form.name || ""}
              onChange={handleInputChange}
            />

            <TextField
              variant="standard"
              name="level"
              label="Level"
              autoComplete="off"
              type="number"
              fullWidth
              style={{ flex: 0.5 }}
              required
              value={form.level || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className={pannelStyles.buttonsGroup}>
            <Button
              title="Salvar alterações"
              text="Salvar"
              background="#09d687"
              color="white"
              type="submit"
            />
            <Button
              title="Descartar alterações"
              text="Descartar"
              color="#eb326a"
              outlined
              type="button"
              onClick={() => discardChanges()}
            />
          </div>
        </form>
      )}

      <div className={pannelStyles.cardList}>
        <button className={pannelStyles.addButton} onClick={() => startEdit()}>
          <FiPlus size={36} color="#8b8b8b" />
        </button>

        {experiences.map((experience) => (
          <div key={experience.id} className={pannelStyles.card}>
            <h4 className={pannelStyles.title}>{experience.name}</h4>

            <MessageInfo
              icon={<GiUpgrade />}
              titleInfo="Level"
              content={experience.level}
            />

            <div className={pannelStyles.buttonsGroup}>
              <Button
                title="Editar experiência"
                text="Editar"
                color="gray"
                outlined
                onClick={() => startEdit(experience)}
              />
              <Button
                title="Excluir experiência"
                text="Excluir"
                background="#eb326a"
                color="white"
                onClick={() => handleDeleteItem(experience)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
