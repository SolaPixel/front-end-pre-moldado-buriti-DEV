import { useEffect, useState } from "react";
import styles from "./ModalLots.module.css";
import { PencilLine, PlusCircle, Trash, X, Check } from "phosphor-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "../../../lib/axios";
import { toDate } from "date-fns";

export function ModalLots({ onClose, produto, getProdutos }) {
  const [lotes, setLotes] = useState([]);

  console.log(lotes)

  //requisição para api buscar produtos
  async function getLotes() {
    const response = await api.get(`lotesProduto/${produto.id}`);

    setLotes(response.data.lotes);
  }

  useEffect(() => {
    getLotes();
  }, []);

  const [lote, setLote] = useState({
    numeracao: "",
    quantAdquirida: "",
    dataAquisicao: "",
    valorGasto: "",
    validade: "",
    produtoId: produto.id,
  });

  const [loteEditId, setLoteEditId] = useState(null);
  const [loteEdit, setLoteEdit] = useState({});

  async function handleCreateLote() {
    const formattedData = {
      numeracao: lote.numeracao,
      quantAdquirida: parseInt(lote.quantAdquirida),
      dataAquisicao: lote.dataAquisicao,
      valorGasto: parseFloat(lote.valorGasto),
      validade: lote.validade || null,
      produtoId: lote.produtoId,
    };

    try {
      await api.post("lotes", formattedData);
      setLote({
        numeracao: "",
        quantAdquirida: "",
        dataAquisicao: "",
        valorGasto: "",
        validade: "",
        produtoId: produto.id,
      });
      getLotes();
      toast.success("Lote adicionado com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar lote!");
      console.log(error);
    }
  }

  function handleActionEditLote(item) {
    setLoteEditId(item.id);
    setLoteEdit(item);
  }

  async function handleEditLote() {
    const formattedData = {
      id: loteEdit.id,
      numeracao: loteEdit?.numeracao,
      quantAtual: parseInt(loteEdit?.quantAtual),
      dataAquisicao: loteEdit?.dataAquisicao,
      valorGasto: parseFloat(loteEdit?.valorGasto),
      validade: loteEdit?.validade || null,
      produtoId: loteEdit.produtoId,
    };

    console.log(formattedData);

    try {
      await api.put(`/loteInfo`, formattedData);
      setLoteEditId(null);
      setLoteEdit({});
      getLotes();
      toast.success("Lote atualizado!");
    } catch (error) {
      toast.error("Erro ao atualizar lote.");
    }
  }

  async function handleDeleteLote(id) {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este lote?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/lote/${id}`);
      getLotes();
      toast.success("Lote excluído!");
    } catch (error) {
      toast.error("Erro ao excluir o lote.");
    }
  }

  const handleClose = () => {
    getProdutos(); // Atualiza a lista de produtos
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Retorna vazio se não houver data
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Retorna vazio se a data for inválida
  
    return date.toISOString().split("T")[0]; // Converte para 'YYYY-MM-DD'
  };
  

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <X onClick={handleClose} className={styles.closeButton} />
        <h1>Novo lote</h1>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Numeração</label>
            <input
              type="text"
              value={lote.numeracao}
              onChange={(e) =>
                setLote((prev) => ({ ...prev, numeracao: e.target.value }))
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label>Quantidade</label>
            <input
              type="text"
              value={lote.quantAdquirida}
              onChange={(e) =>
                setLote((prev) => ({ ...prev, quantAdquirida: e.target.value }))
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label>Valor investido</label>
            <input
              type="number"
              value={lote.valorGasto}
              onChange={(e) =>
                setLote((prev) => ({ ...prev, valorGasto: e.target.value }))
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label>Data de aquisição</label>
            <input
              type="date"
              value={lote.dataAquisicao}
              onChange={(e) =>
                setLote((prev) => ({ ...prev, dataAquisicao: e.target.value }))
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label>Validade</label>
            <input
              type="date"
              value={lote.validade}
              onChange={(e) =>
                setLote((prev) => ({ ...prev, validade: e.target.value }))
              }
            />
          </div>

          <button
            className={styles.mainBtn}
            type="button"
            onClick={handleCreateLote}
          >
            <PlusCircle size={16} /> Adicionar
          </button>
        </div>

        <div className={styles.line} />

        <div className={styles.lotes}>
          {lotes.length > 0 ? (
            lotes.map((item) => (
              <div className={styles.formRow} key={item.id}>
                <div className={styles.formGroup}>
                  <label>Numeração</label>
                  <input
                    type="text"
                    value={
                      loteEditId === item.id
                        ? loteEdit.numeracao
                        : item.numeracao
                    }
                    onChange={(e) =>
                      setLoteEdit({ ...loteEdit, numeracao: e.target.value })
                    }
                    disabled={loteEditId !== item.id}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Quantidade atual</label>
                  <input
                    type="text"
                    value={
                      loteEditId === item.id
                        ? loteEdit.quantAtual
                        : item.quantAtual
                    }
                    onChange={(e) =>
                      setLoteEdit({ ...loteEdit, quantAtual: e.target.value })
                    }
                    disabled={loteEditId !== item.id}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Data de aquisição</label>
                  <input
                    type="date"
                    value={
                      loteEditId === item.id
                        ? formatDate(loteEdit.dataAquisicao)
                        : formatDate(item.dataAquisicao)
                    }
                    onChange={(e) =>
                      setLoteEdit({
                        ...loteEdit,
                        dataAquisicao: e.target.value,
                      })
                    }
                    disabled={loteEditId !== item.id}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Valor investido</label>
                  <input
                    type="number"
                    value={
                      loteEditId === item.id
                        ? loteEdit.valorGasto
                        : item.valorGasto
                    }
                    onChange={(e) =>
                      setLoteEdit({ ...loteEdit, valorGasto: e.target.value })
                    }
                    disabled={loteEditId !== item.id}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Validade</label>
                  <input
                    type="date"
                    value={
                      loteEditId === item.id ? formatDate(loteEdit.validade) : formatDate(item.validade)
                    }
                    onChange={(e) =>
                      setLoteEdit({ ...loteEdit, validade: e.target.value })
                    }
                    disabled={loteEditId !== item.id}
                  />
                </div>

                {loteEditId === item.id ? (
                  <button
                    className={styles.saveBtn}
                    type="button"
                    onClick={() => handleEditLote(item.id)}
                  >
                    <Check size={16} />
                  </button>
                ) : (
                  <button
                    className={styles.mainBtn}
                    type="button"
                    onClick={() => handleActionEditLote(item)}
                  >
                    <PencilLine size={16} />
                  </button>
                )}
                <button
                  className={styles.deleteBtn}
                  type="button"
                  onClick={() => handleDeleteLote(item.id)}
                >
                  <Trash size={16} />
                </button>
              </div>
            ))
          ) : (
            <p>Você ainda não cadastrou nenhum lote</p>
          )}
        </div>
      </div>
    </div>
  );
}
