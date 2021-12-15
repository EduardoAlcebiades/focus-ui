import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { MenuItem, TextField } from "@mui/material";
import { BiCategoryAlt } from "react-icons/bi";
import { BsBarChartLineFill } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import { Button } from "../Button";
import { MessageInfo } from "../MessageInfo";

import { IExercise } from "../../models/IExercise";
import { IExperience } from "../../models/IExperience";
import { ICategory } from "../../models/ICategory";

import pannelStyles from "../../styles/pannelStyles.module.scss";
import ExerciseService, { IExerciseData } from "../../services/ExerciseService";
import ExperienceService from "../../services/ExperienceService";
import CategoryService from "../../services/CategoryService";

interface IFormData extends IExerciseData {
  id: string;
}

export const ExercisePanel: React.FC = () => {
  const [exercises, setExercises] = useState<IExercise[]>([]);
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [form, setForm] = useState<IFormData | null>(null);
  const [formChanges, setFormChanges] = useState<object>({});

  async function refreshExercises() {
    const response = await ExerciseService.index();

    setExercises(response.data);
  }

  async function refreshExperiences() {
    const response = await ExperienceService.index();

    setExperiences(response.data);
  }

  async function refreshCategories() {
    const response = await CategoryService.index();

    setCategories(response.data);
  }

  async function submit(data: IExerciseData, id?: string) {
    if (id) await ExerciseService.update(id, data);
    else await ExerciseService.store(data);
  }

  async function deleteItem(id: string) {
    await ExerciseService.delete(id);
  }

  const refresh = useCallback(async () => {
    await refreshExercises();
    await refreshExperiences();
    await refreshCategories();
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

          refreshExercises().catch(() =>
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
    (exercise: IExercise) => {
      if (window.confirm(`Deseja realmente excluir '${exercise.name}'?`))
        deleteItem(exercise.id)
          .then(() => {
            discardChanges({ hideAlert: true });

            refreshExercises().catch(() =>
              alert("Ocorreu um erro ao carregar os dados")
            );
          })
          .catch(() => alert("Ocorreu um erro ao deletar o item"));
    },
    [discardChanges]
  );

  function startEdit(exercise?: IFormData) {
    if (discardChanges()) setForm(exercise || ({} as IFormData));
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
              name="xp_amount"
              label="Qtd. XP"
              placeholder="Ex. (80, 150)"
              type="number"
              style={{ flex: 0.5 }}
              required
              value={form.xp_amount || ""}
              onChange={handleInputChange}
            />
          </div>

          <TextField
            variant="standard"
            name="category_id"
            label="Categoria"
            required
            select
            value={form.category_id || ""}
            onChange={handleInputChange}
          >
            <MenuItem value="">-</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>

          <div className={pannelStyles.line}>
            <TextField
              variant="standard"
              name="min_experience_id"
              label="Exp. Mínima"
              select
              value={form.min_experience_id || ""}
              onChange={handleInputChange}
            >
              <MenuItem value="">
                <i>Qualquer nível</i>
              </MenuItem>
              {experiences.map((experience) => (
                <MenuItem key={experience.id} value={experience.id}>
                  {experience.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              variant="standard"
              name="max_experience_id"
              label="Exp. Máxima"
              select
              value={form.max_experience_id || ""}
              onChange={handleInputChange}
            >
              <MenuItem value="">
                <i>Qualquer nível</i>
              </MenuItem>
              {experiences.map((experience) => (
                <MenuItem key={experience.id} value={experience.id}>
                  {experience.name}
                </MenuItem>
              ))}
            </TextField>
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
              onClick={() => discardChanges()}
            />
          </div>
        </form>
      )}

      <div className={pannelStyles.cardList}>
        <button className={pannelStyles.addButton} onClick={() => startEdit()}>
          <FiPlus size={36} color="#8b8b8b" />
        </button>

        {exercises.map((exercise) => (
          <div key={exercise.id} className={pannelStyles.card}>
            <h4
              className={pannelStyles.title}
            >{`${exercise.name} (${exercise.xp_amount}xp)`}</h4>

            <MessageInfo
              icon={<BiCategoryAlt />}
              titleInfo="Categoria"
              content={exercise.category?.name}
            />

            <div className={pannelStyles.footer}>
              <MessageInfo
                icon={<BsBarChartLineFill />}
                titleInfo="Exp. mínima"
                content={exercise.minExperience?.name || "-"}
              />

              <MessageInfo
                icon={<BsBarChartLineFill />}
                titleInfo="Exp. máxima"
                content={exercise.maxExperience?.name || "-"}
              />
            </div>

            <div className={pannelStyles.buttonsGroup}>
              <Button
                title="Editar exercício"
                text="Editar"
                color="gray"
                outlined
                onClick={() => startEdit(exercise as IFormData)}
              />
              <Button
                title="Excluir exercício"
                text="Excluir"
                background="#eb326a"
                color="white"
                onClick={() => handleDeleteItem(exercise)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
