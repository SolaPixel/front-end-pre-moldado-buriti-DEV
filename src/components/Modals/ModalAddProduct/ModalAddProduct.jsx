import { useState, useEffect } from "react";
import styles from "./ModalAddProduct.module.css";
import { ToastContainer, toast } from "react-toastify";
import { api } from "../../../lib/axios";
import { X } from "phosphor-react";

import CurrencyInput from 'react-currency-input-field';

export function ModalAddProduct({ onClose, categorias, getProdutos }) {
  const [formData, setFormData] = useState({
    numeracao: "",
    nome: "",
    descricao: "",
    categoriaId: "",
    unidadeMedida: "UNITARIA",
    valorAtacado: "",
    valorVarejo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateProduto = async (e) => {
    e.preventDefault();

    const formattedData = {
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
      const response = await api.post("produtos", formattedData);

      setFormData({
        numeracao: "",
        nome: "",
        descricao: "",
        categoriaId: "", // Inicializado como string vazia
        unidadeMedida: "UNITARIA",
        valorAtacado: "",
        valorVarejo: "",
      }); // Limpa o input

      toast.success("produto adicionado com sucesso!");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("Este produto já existe!");

        return;
      }
      toast.error("Erro ao adicionar produto!");
    }
  };

  const handleClose = () => {
    getProdutos(); // Atualiza a lista de produtos
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h1>Novo Produto</h1>

        <div className={styles.line} />

        <form onSubmit={handleCreateProduto}>
          <X onClick={handleClose} className={styles.closeButton} />

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Numeração:</label>
              <input
                type="text"
                name="numeracao"
                required
                value={formData.numeracao}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Nome do produto:</label>
              <input
                type="text"
                name="nome"
                required
                value={formData.nome}
                onChange={handleChange}
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
                required
              >
                <option value="UNITARIA">Unitária</option>
                <option value="METRICA">Métrica</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Preço unitário:</label>
              <CurrencyInput
                prefix="R$ "
                decimalSeparator="."
                groupSeparator=" "
                decimalsLimit={2}
                value={formData.valorVarejo}
                onValueChange={(value) => handleChange({ target: { name: "valorVarejo", value } })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Preço uni. atacado:</label>
              <CurrencyInput
                prefix="R$ "
                decimalSeparator="."
                groupSeparator=" "
                decimalsLimit={2}
                value={formData.valorAtacado}
                onValueChange={(value) => handleChange({ target: { name: "valorAtacado", value } })}
              />
            </div>
          </div>

          <div className={styles.buttonRow}>
            <button className={styles.mainBtn} type="submit">
              Cadastrar
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
