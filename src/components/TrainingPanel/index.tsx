import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { MenuItem, TextField } from "@mui/material";
import { BiDumbbell } from "react-icons/bi";
import { FiPlus } from "react-icons/fi";
import { MdPerson, MdToday } from "react-icons/md";
import { CgGym } from "react-icons/cg";

import { Button } from "../Button";
import { MessageInfo } from "../MessageInfo";
import { ITraining } from "../../models/ITraining";
import { IExperience } from "../../models/IExperience";
import { IUser } from "../../models/IUser";
import { ICategory } from "../../models/ICategory";
import { IExercise } from "../../models/IExercise";
import TrainingService, {
  ITrainingData,
  ITrainingItemData,
} from "../../services/TrainingService";
import ExerciseService from "../../services/ExerciseService";
import ExperienceService from "../../services/ExperienceService";
import CategoryService from "../../services/CategoryService";
import UserService from "../../services/UserService";

import pannelStyles from "../../styles/pannelStyles.module.scss";

interface IFormData extends ITrainingData {
  id: string;
}

interface IFormItemData extends ITrainingItemData {
  id: string;
}

const weekDays = [
  { value: "0", label: "Domingo" },
  { value: "1", label: "Segunda-Feira" },
  { value: "2", label: "Terça-Feira" },
  { value: "3", label: "Quarta-Feira" },
  { value: "4", label: "Quinta-Feira" },
  { value: "5", label: "Sexta-Feira" },
  { value: "6", label: "Sábado" },
];

export const TrainingPanel: React.FC = () => {
  const [trainings, setTrainings] = useState<ITraining[]>([]);
  const [exercises, setExercises] = useState<IExercise[]>([]);
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);

  const [trainingItems, setTrainingItems] = useState<IFormItemData[]>([]);
  const [trainingItemsHasChanges, setTrainingItemsHasChanges] =
    useState<boolean>(false);

  const [form, setForm] = useState<IFormData | null>(null);
  const [formChanges, setFormChanges] = useState<object>({});

  async function refreshTrainings() {
    const response = await TrainingService.index();

    response.data.map((item) => {
      item.trainingItems?.sort((a, b) => {
        if (a.exercise_id && !b.exercise_id) return 1;
        if (!a.exercise_id && b.exercise_id) return -1;

        return 0;
      });

      return item;
    });

    setTrainings(response.data);
  }

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

  async function refreshUsers() {
    const response = await UserService.index();

    setUsers(response.data);
  }

  async function submit(data: ITrainingData, id?: string) {
    if (id) await TrainingService.update(id, data);
    else await TrainingService.store(data);
  }

  async function deleteItem(id: string) {
    await TrainingService.delete(id);
  }

  const refresh = useCallback(async () => {
    await refreshTrainings();
    await refreshExercises();
    await refreshExperiences();
    await refreshCategories();
    await refreshUsers();
  }, []);

  const addTrainingItem = useCallback(() => {
    const trainingItem = { id: new Date().getTime().toString() };

    setTrainingItems((prev) => [trainingItem as IFormItemData, ...prev]);
    setTrainingItemsHasChanges(true);
  }, []);

  const removeTrainingItem = useCallback((id: string) => {
    setTrainingItems((prev) => prev.filter((item) => item.id !== id));

    setTrainingItemsHasChanges(true);
  }, []);

  const handleInputItemChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: string) => {
      const { name, value } = ev.target;

      setTrainingItems((prev) =>
        prev.map((trainingItem) => {
          if (trainingItem.id === id) {
            trainingItem = { ...trainingItem, [name]: value };

            if (name === "category_id") trainingItem.exercise_id = null;
            else if (name === "exercise_id") {
              trainingItem.category_id = null;
              trainingItem.amount = null;
            }
          }

          return trainingItem;
        })
      );

      setTrainingItemsHasChanges(true);
    },
    []
  );

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
        (hasChange || trainingItemsHasChanges) &&
        !window.confirm("Deseja descartar as alterações?")
      )
        return false;

      setForm(null);
      setFormChanges({});

      return true;
    },
    [form, formChanges, trainingItemsHasChanges]
  );

  const handleSubmit = useCallback(
    (ev: FormEvent) => {
      ev.preventDefault();

      if (!form) return;

      const { id, ...data } = form;

      data.trainingItems = trainingItems.map((item) => {
        const { id, ...data } = item;

        return data;
      });

      submit(data, id)
        .then(() => {
          discardChanges({ hideAlert: true });

          refreshTrainings().catch(() =>
            alert("Ocorreu um erro ao carregar os dados")
          );
        })
        .catch((err) => {
          if (err.response?.status === 409) alert("Este item já existe");
          alert("Ocorreu um erro ao salvar os dados");
        });
    },
    [form, discardChanges, trainingItems]
  );

  const handleDeleteItem = useCallback(
    (training: IFormData) => {
      if (window.confirm(`Deseja realmente excluir '${training.name}'?`))
        deleteItem(training.id)
          .then(() => {
            discardChanges({ hideAlert: true });

            refreshTrainings().catch(() =>
              alert("Ocorreu um erro ao carregar os dados")
            );
          })
          .catch(() => alert("Ocorreu um erro ao deletar o item"));
    },
    [discardChanges]
  );

  function startEdit(training?: IFormData) {
    if (discardChanges()) {
      setForm(training || ({} as IFormData));
      setTrainingItems((training?.trainingItems as IFormItemData[]) || []);
      setTrainingItemsHasChanges(false);
    }
  }

  useEffect(() => {
    refresh().catch(() => alert("Ocorreu um erro ao carregar os dados"));
  }, [refresh]);

  return (
    <div className={pannelStyles.container}>
      {form && (
        <form className={pannelStyles.editForm} onSubmit={handleSubmit}>
          <TextField
            variant="standard"
            name="name"
            label="Nome"
            autoComplete="off"
            fullWidth
            autoFocus
            required
            value={form.name || ""}
            onChange={handleInputChange}
          />

          <div className={pannelStyles.line}>
            <TextField
              variant="standard"
              name="week_day"
              label="Dia da Semana"
              fullWidth
              select
              value={form.week_day || ""}
              onChange={handleInputChange}
            >
              <MenuItem value="">
                <i>Qualquer dia</i>
              </MenuItem>
              {weekDays.map((weekDay) => (
                <MenuItem key={weekDay.value} value={weekDay.value}>
                  {weekDay.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              variant="standard"
              name="experience_id"
              label="Nível de Exp."
              fullWidth
              select
              value={form.experience_id || ""}
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

          <TextField
            variant="standard"
            name="user_id"
            label="Usuário"
            fullWidth
            select
            value={form.user_id || ""}
            onChange={handleInputChange}
          >
            <MenuItem value="">
              <i>Qualquer usuário</i>
            </MenuItem>

            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {"#"}
                {user.code} - {user.first_name} {user.last_name}
              </MenuItem>
            ))}
          </TextField>

          <div className={pannelStyles.formCardList}>
            <button
              className={pannelStyles.addButton}
              type="button"
              onClick={addTrainingItem}
            >
              <FiPlus size={24} color="#8b8b8b" />
            </button>

            {trainingItems.map((trainingItem) => (
              <div key={trainingItem.id} className={pannelStyles.card}>
                <div className={pannelStyles.line}>
                  <TextField
                    variant="standard"
                    name="category_id"
                    label="Categoria"
                    fullWidth
                    select
                    required={!trainingItem.exercise_id}
                    value={trainingItem.category_id || ""}
                    onChange={(ev) =>
                      handleInputItemChange(ev, trainingItem.id)
                    }
                  >
                    <MenuItem value="">-</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    variant="standard"
                    name="exercise_id"
                    label="Exercício"
                    fullWidth
                    select
                    required={!trainingItem.category_id}
                    value={trainingItem.exercise_id || ""}
                    onChange={(ev) =>
                      handleInputItemChange(ev, trainingItem.id)
                    }
                  >
                    <MenuItem value="">-</MenuItem>
                    {exercises.map((exercise) => (
                      <MenuItem key={exercise.id} value={exercise.id}>
                        {exercise.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>

                <div className={pannelStyles.line}>
                  <TextField
                    variant="outlined"
                    margin="dense"
                    name="amount"
                    label="Qtd."
                    type="number"
                    autoComplete="off"
                    fullWidth
                    disabled={Boolean(trainingItem.exercise_id)}
                    value={trainingItem.amount || ""}
                    required={!trainingItem.exercise_id}
                    onChange={(ev) =>
                      handleInputItemChange(ev, trainingItem.id)
                    }
                  />
                  <TextField
                    variant="outlined"
                    margin="dense"
                    name="series"
                    label="Série"
                    type="number"
                    autoComplete="off"
                    fullWidth
                    value={trainingItem.series || ""}
                    required
                    onChange={(ev) =>
                      handleInputItemChange(ev, trainingItem.id)
                    }
                  />
                  <TextField
                    variant="outlined"
                    margin="dense"
                    name="times"
                    label="Vezes"
                    type="number"
                    autoComplete="off"
                    fullWidth
                    value={trainingItem.times || ""}
                    required
                    onChange={(ev) =>
                      handleInputItemChange(ev, trainingItem.id)
                    }
                  />
                </div>

                <Button
                  title="Remover item do treino"
                  text="Remover"
                  background="#eb326a"
                  color="white"
                  type="button"
                  onClick={() => removeTrainingItem(trainingItem.id)}
                />
              </div>
            ))}
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

        {trainings.map((training) => (
          <div key={training.id} className={pannelStyles.card}>
            <h4 className={pannelStyles.title}>
              {training.name}{" "}
              {training.experience_id && (
                <span>({training.experience?.name})</span>
              )}
            </h4>
            <ul>
              {training.trainingItems?.map((item) => (
                <li key={item.id}>
                  {item.category_id ? (
                    <>
                      <BiDumbbell />{" "}
                      <p>
                        <strong>({item.amount}x)</strong> {item.category?.name}{" "}
                        - {item.series}x{item.times}
                      </p>
                    </>
                  ) : (
                    <>
                      <CgGym />{" "}
                      <p>
                        {item.exercise?.name} - {item.series}x{item.times}
                      </p>
                    </>
                  )}
                </li>
              ))}
            </ul>

            <div className={pannelStyles.footer}>
              <MessageInfo
                icon={<MdToday />}
                titleInfo="Dia da Semana"
                content={
                  weekDays.find(
                    (item) => item.value === training.week_day?.toString()
                  )?.label || "-"
                }
              />
              <MessageInfo
                icon={<MdPerson />}
                titleInfo="Usuário"
                content={
                  training.user
                    ? `${training.user.first_name} #${training.user.code}`
                    : "-"
                }
              />
            </div>

            <div className={pannelStyles.buttonsGroup}>
              <Button
                title="Editar treino"
                text="Editar"
                color="gray"
                outlined
                onClick={() => startEdit(training as IFormData)}
              />
              <Button
                title="Excluir treino"
                text="Excluir"
                background="#eb326a"
                color="white"
                onClick={() => handleDeleteItem(training as IFormData)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
