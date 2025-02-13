import { useState } from "react";
import styles from "./NewProduto.module.css";
import { ToastContainer, toast } from "react-toastify";
import { api } from "../lib/axios";

export function ModalProduto({
  onClose,
  categorias,
  getProdutos,
  produto,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    numeracao: produto.numeracao,
    nome: produto.nome,
    descricao: produto.descricao || "",
    categoriaId: produto.categoriaId || "",
    unidadeMedida: produto.unidadeMedida,
    valorAtacado: produto.valorAtacado,
    valorVarejo: produto.valorVarejo,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //função para iniciar a ação de edição
  function handleActionEditProduto() {
    console.log("edittar");
    setIsEditing(true);
  }

  const handleEditProduto = async (e) => {
    e.preventDefault();

    const formattedData = {
      id: produto.id,
      numeracao: formData.numeracao,
      nome: formData.nome,
      descricao: formData.descricao || null,
      categoriaId: formData.categoriaId || null,
      unidadeMedida: formData.unidadeMedida,
      valorAtacado: parseFloat(formData.valorAtacado),
      valorVarejo: parseFloat(formData.valorVarejo),
    };

    console.log(formattedData);
    try {
      const response = await api.put("produtoInfo", formattedData);

      setIsEditing(false);

      toast.success("produto editado com sucesso!");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("Este produto já existe!");

        return;
      }
      console.log(error);
      toast.error("Erro ao adicionar produto!");
    }
  };

  const handleDeleteProduto = async () => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este produto?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/produto/${produto.id}`);
      getProdutos(); // Atualiza a lista de produtos
      onSuccess("Produto excluído com sucesso!");
      onClose(); // Fecha o modal
    } catch (error) {
      toast.error("Erro ao excluir o produto. Tente novamente.");
      console.error("Erro ao excluir produto:", error);
    }
  };

  const handleClose = () => {
    getProdutos(); // Atualiza a lista de produtos
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <form>
          <button onClick={handleClose} className={styles.closeButton}>
            X
          </button>

          <div className={styles.formRow}>
            <div className={styles.smalldiv}>
              <label>Numeração:</label>
              <input
                type="text"
                name="numeracao"
                value={formData.numeracao}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Nome do produto:</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Descrição do produto:</label>
              <input
                type="text"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Categoria:</label>
              <select
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Tipo de medida:</label>
              <select
                name="unidadeMedida"
                value={formData.unidadeMedida}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="UNITARIA">Unitária</option>
                <option value="METRICA">Métrica</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Preço unitário:</label>
              <input
                type="number"
                name="valorVarejo"
                value={formData.valorVarejo}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Preço uni. atacado:</label>
              <input
                type="number"
                name="valorAtacado"
                value={formData.valorAtacado}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.buttonContainer}>
              {isEditing ? (
                <button type="button" onClick={handleEditProduto}>
                  Salvar
                </button>
              ) : (
                <button type="button" onClick={() => handleActionEditProduto()}>
                  Editar
                </button>
              )}
            </div>
            <div className={styles.buttonContainer}>
              <button type="button" onClick={handleDeleteProduto}>
                Excluir
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
