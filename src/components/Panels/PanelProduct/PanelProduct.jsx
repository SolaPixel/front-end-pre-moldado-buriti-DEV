import { useState, useEffect } from "react";
import {
  DotsThreeVertical,
  MagnifyingGlass,
  PencilSimple,
} from "phosphor-react";

import styles from "./PanelProduct.module.css";
import { api } from "../../../lib/axios.js";
import { ModalAddProduct } from "../../Modals/ModalAddProduct/ModalAddProduct.jsx";
import { ToastContainer, toast } from "react-toastify";
import { ModalCategory } from "../../Modals/ModalCategory/ModalCategory.jsx";
import { ModalLots } from "../../Modals/ModalLots/ModalLots.jsx";
import { ModalProduct } from "../../Modals/ModalProduct/ModalProduct.jsx";

export function PanelProduct({ produtos, getProdutos }) {
  const [searchTerm, setSearchTerm] = useState("");

  const [categorias, setCategorias] = useState([]);
  const [filterCategoria, setFilterCategoria] = useState("Todos"); // Corrigido para "Todos"

  async function getCategorias() {
    const response = await api.get("allCategorias");

    setCategorias(response.data.categorias);
    console.log(response);
  }

  useEffect(() => {
    getCategorias();
  }, []);

  //estados que gerenciam visibilidade de modais
  const [showModalCategoria, setShowModalCategoria] = useState(false);
  const [showModalAddProduct, setShowModalAddProduct] = useState(false);
  const [showModalProduct, setShowModalProduct] = useState(false);
  const [showModalLots, setShowModalLots] = useState(false);

  //produto selecionado a fim de ser enviado à respectivos modais
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  //gerencia diretamente visibilidade dos modais
  const openCategorias = () => {
    setShowModalCategoria(true);
  };

  const openModalAddProduct = () => {
    setShowModalAddProduct(true);
  };

  const openProduto = (produto) => {
    setProdutoSelecionado(produto);
    setShowModalProduct(true);
  };

  const openLotes = (produto) => {
    setProdutoSelecionado(produto);
    setShowModalLots(true);
  };

  const closeModalCategoria = () => {
    setShowModalCategoria(false);
  };

  const closeModalAddProduct = () => {
    setShowModalAddProduct(false);
  };

  const closeModalProduct = () => {
    setShowModalProduct(false);
  };

  const closeModalLots = () => {
    setShowModalLots(false);
  };

  const handleSuccessMessage = (message) => {
    toast.success(message);
  };

  // Filtrar produtos pelo nome de acordo com o termo de pesquisa
  const filtrarProdutosPorNome = (produto) => {
    return produto.nome.toLowerCase().includes(searchTerm.toLowerCase());
  };

  //recebe os produtos e retorna os que se adequam a condição
  const filtrarProdutosPorCategoria = (produto) => {
    if (filterCategoria === "Todos") {
      return true; // Retorna todos os produtos se a categoria for "Todos"
    }
    return produto.categoriaId === filterCategoria;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.search}>
          <MagnifyingGlass />
          <input
            type="text"
            placeholder="Digite o nome do produto:"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // className={styles.searchInput}
          />
        </div>

        <div className={styles.buttons}>
          <div className={styles.buttonFilter}>
            <span>Filtrar</span>
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
            >
              <option value="Todos">Todos</option>
              {categorias.length > 0 &&
                categorias.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <button onClick={openCategorias} className={styles.buttonFull}>
              Categorias
            </button>
            {showModalCategoria && (
              <ModalCategory
                onClose={closeModalCategoria}
                categorias={categorias}
                getCategorias={getCategorias}
                getProdutos={getProdutos}
              />
            )}
          </div>

          <div>
            <button onClick={openModalAddProduct} className={styles.buttonFull}>
              Inserir Produto
            </button>
            {showModalAddProduct && (
              <ModalAddProduct
                onClose={closeModalAddProduct}
                categorias={categorias}
                getProdutos={getProdutos}
              />
            )}
          </div>
        </div>
      </div>
      <table className={styles.produtos}>
        <thead>
          <tr>
            <th>Detalhes</th>
            <th>Numeração</th>
            <th>Item</th>
            <th>Categoria</th>
            <th>Tipo de medida</th>
            <th>Valor unitário</th>
            <th>Valor uni. atacado</th>
            <th>Estoque disponível</th>
          </tr>
        </thead>
        <tbody>
          {produtos
            .filter(filtrarProdutosPorCategoria) //instanciando a função de filtrar por categoria
            .filter(filtrarProdutosPorNome) // instanciando a função de filtrar por nome
            .map((item) => (
              <tr key={item.id}>
                <td>
                  <DotsThreeVertical
                    size={10}
                    className={styles.more}
                    onClick={() => openProduto(item)}
                  />
                  {showModalProduct && produtoSelecionado && (
                    <ModalProduct
                      produto={produtoSelecionado}
                      onClose={closeModalProduct}
                      categorias={categorias}
                      getProdutos={getProdutos}
                      onSuccess={handleSuccessMessage}
                    />
                  )}
                </td>
                <td>{item.numeracao}</td>
                <td>{item.nome}</td>
                <td>{item.categoria?.nome || "--"} </td>
                <td>{item.unidadeMedida}</td>
                <td>{parseFloat(item.valorVarejo).toFixed(2)} R$</td>
                <td>{parseFloat(item.valorAtacado).toFixed(2)} R$</td>
                {/* teste */}
                <td
                  className={styles.clickable}
                  onClick={() => openLotes(item)}
                >
                  {item.quantEstoque}

                  <PencilSimple size={16} />
                </td>

                {showModalLots && (
                  <ModalLots
                    produto={produtoSelecionado}
                    onClose={closeModalLots}
                    getProdutos={getProdutos}
                  />
                )}
                {/* teste */}

                {/* original */}
                {/* <td>
                  <button
                    className={styles.buttonLots}
                    onClick={() => openLotes(item)}
                  >
                    {item.quantEstoque}
                  </button>
                  {showModalLots && (
                    <ModalLots
                      produto={produtoSelecionado}
                      onClose={closeModalLots}
                      getProdutos={getProdutos}
                    />
                  )}
                </td> */}
                {/* original */}
              </tr>
            ))}
        </tbody>
      </table>

      <ToastContainer />
    </div>
  );
}
