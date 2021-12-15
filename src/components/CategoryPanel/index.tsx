import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { TextField } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Button } from "../Button";

import { ICategory } from "../../models/ICategory";

import pannelStyles from "../../styles/pannelStyles.module.scss";
import CategoryService from "../../services/CategoryService";

export const CategoryPanel: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [form, setForm] = useState<ICategory | null>(null);
  const [formChanges, setFormChanges] = useState<object>({});

  async function refreshCategories() {
    const response = await CategoryService.index();

    setCategories(response.data);
  }

  async function submit(name: string, id?: string) {
    if (id) await CategoryService.update(id, name);
    else await CategoryService.store(name);
  }

  async function deleteItem(id: string) {
    await CategoryService.delete(id);
  }

  const refresh = useCallback(async () => {
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

  function startEdit(category?: ICategory) {
    if (discardChanges()) setForm(category || ({} as ICategory));
  }

  const handleSubmit = useCallback(
    (ev: FormEvent) => {
      ev.preventDefault();

      if (!form) return;

      const { id, name } = form;

      submit(name, id)
        .then(() => {
          discardChanges({ hideAlert: true });

          refreshCategories().catch(() =>
            alert("Ocorreu um erro ao carregar os dados")
          );
        })
        .catch((err) => {
          if (err.response?.status === 409) alert("Este item já existe");
          else alert("Ocorreu um erro ao salvar os dados");
        });
    },
    [form, discardChanges]
  );

  const handleDeleteItem = useCallback(
    (experience: ICategory) => {
      if (window.confirm(`Deseja realmente excluir '${experience.name}'?`))
        deleteItem(experience.id)
          .then(() => {
            discardChanges({ hideAlert: true });

            refreshCategories().catch(() =>
              alert("Ocorreu um erro ao carregar os dados")
            );
          })
          .catch(() => alert("Ocorreu um erro ao deletar o item"));
    },
    [discardChanges]
  );

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
            required
            autoFocus
            value={form.name || ""}
            onChange={handleInputChange}
          />

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
              type="button"
            />
          </div>
        </form>
      )}

      <div className={pannelStyles.cardList}>
        <button className={pannelStyles.addButton} onClick={() => startEdit()}>
          <FiPlus size={36} color="#8b8b8b" />
        </button>

        {categories.map((category) => (
          <div key={category.id} className={pannelStyles.card}>
            <h4 className={pannelStyles.title}>{category.name}</h4>

            <div className={pannelStyles.buttonsGroup}>
              <Button
                title="Editar categoria"
                text="Editar"
                color="gray"
                outlined
                onClick={() => startEdit(category)}
              />
              <Button
                title="Excluir categoria"
                text="Excluir"
                background="#eb326a"
                color="white"
                onClick={() => handleDeleteItem(category)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
