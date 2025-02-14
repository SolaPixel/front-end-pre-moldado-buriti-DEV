import { useState } from "react";
import styles from "./ModalCategory.module.css";
import { PencilLine, PlusCircle, Trash, X, Check } from "phosphor-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "../../../lib/axios";

export function ModalCategory({
  onClose,
  getCategorias,
  categorias,
  getProdutos,
}) {
  const [categoria, setCategoria] = useState("");

  const [categoriaEditId, setCategoriaEditId] = useState(null);
  const [categoriaEdit, setCategoriaEdit] = useState({});

  //função para adicionar categoria
  async function handleCreateCategoria() {
    if (!categoria.trim()) {
      toast.warn("O nome da categoria não pode estar vazio!");
      return;
    }

    try {
      const response = await api.post("categorias", { nome: categoria });

      getCategorias();
      setCategoria(""); // Limpa o input
      toast.success("Categoria adicionada com sucesso!");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("Esta categoria já existe!");

        return;
      }
      toast.error("Erro ao adicionar categoria!");
    }
  }

  //função para iniciar a ação de edição
  function handleActionEditCategoria(id, nome) {
    setCategoriaEditId(id);
    setCategoriaEdit((prev) => ({ ...prev, [id]: nome }));
  }

  //função para editar a categoria
  async function handleEditCategoria(id) {
    const novoNome = categoriaEdit[id];

    if (!novoNome.trim()) {
      toast.warn("O nome da categoria não pode estar vazio!");
      return;
    }

    try {
      await api.put("/categoriaInfo", { id, nome: novoNome });
      toast.success("Categoria atualizada!");
      setCategoriaEditId(null); // Fecha o modo de edição
      getCategorias(); // Atualiza a lista de categorias
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("Esta categoria já existe!");

        return;
      }
      toast.error("Erro ao atualizar categoria.");
    }
  }

  async function handleDeleteCategoria(id) {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir esta categoria?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/categoria/${id}`);
      getCategorias(); // Atualiza a lista de produtos
      toast.success("Categoria excluida!");
    } catch (error) {
      toast.error("Erro ao excluir a categoria");
      console.error("Erro ao excluir produto:", error);
    }
  }

  const handleClose = () => {
    getProdutos(); // Atualiza a lista de produtos
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <X onClick={handleClose} className={styles.closeButton} />
        <h1>Nova categoria</h1>

        <div className={styles.inputRow}>
          <div className={styles.inputs}>
            <input
              type="text"
              placeholder="Nome da categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            />
          </div>

          <button
            type="button"
            className={styles.mainBtn}
            onClick={handleCreateCategoria}
          >
            <PlusCircle size={20} /> Adicionar
          </button>
        </div>

        <div className={styles.line} />

        <div className={styles.categorys}>
          {categorias.length > 0 ? (
            categorias.map((item) => (
              <div className={styles.inputRow} key={item.id}>
                <input
                  type="text"
                  value={categoriaEdit[item.id] ?? item.nome}
                  onChange={(e) =>
                    setCategoriaEdit((prev) => ({
                      ...prev,
                      [item.id]: e.target.value,
                    }))
                  }
                  disabled={categoriaEditId !== item.id}
                />

                {categoriaEditId == item.id ? (
                  <button
                    className={styles.saveBtn}
                    type="button"
                    onClick={() => handleEditCategoria(item.id)}
                  >
                    <Check size={16} />
                    Salvar
                  </button>
                ) : (
                  <button
                    className={styles.mainBtn}
                    type="button"
                    onClick={() =>
                      handleActionEditCategoria(item.id, item.nome)
                    }
                  >
                    <PencilLine size={16} /> Editar
                  </button>
                )}

                <button
                  className={styles.deleteBtn}
                  type="button"
                  onClick={() => handleDeleteCategoria(item.id)}
                >
                  <Trash size={16} />
                  Excluir
                </button>
              </div>
            ))
          ) : (
            <p>Você ainda não cadastrou nenhuma categoria</p>
          )}
        </div>
      </div>
    </div>
  );
}
