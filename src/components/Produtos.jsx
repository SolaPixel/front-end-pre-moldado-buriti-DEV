import { useState, useEffect } from 'react';
import { MagnifyingGlass } from 'phosphor-react'

import styles from './Produtos.module.css';
import { ModalCategorias } from './ModalCategorias.jsx';
import { api } from '../lib/axios.js';
import { NewProduto } from './NewProduto.jsx';
import { ModalProduto } from './modalProduto.jsx';
import { ModalLotes } from './ModalLotes.jsx';
import { ToastContainer, toast } from 'react-toastify';

export function Produtos({ produtos, getProdutos }) {

    const [searchTerm, setSearchTerm] = useState('');

    const [categorias, setCategorias] = useState([]);
    const [filterCategoria, setFilterCategoria] = useState("Todos"); // Corrigido para "Todos"


    async function getCategorias() {
        const response = await api.get('allCategorias')

        setCategorias(response.data.categorias)
        console.log(response)
    }

    useEffect(() => {
        getCategorias();

    }, []);

    //estados que gerenciam visibilidade de modais
    const [showModalCategoria, setShowModalCategoria] = useState(false);
    const [showModalNewProduto, setShowModalNewProduto] = useState(false);
    const [showModalProduto, setShowModalProduto] = useState(false);
    const [showModalLotes, setShowModalLotes] = useState(false);

    //produto selecionado a fim de ser enviado à respectivos modais
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);


    //gerencia diretamente visibilidade dos modais
    const openCategorias = () => {
        setShowModalCategoria(true)

    }

    const openNewProduto = () => {
        setShowModalNewProduto(true)

    }

    const openProduto = (produto) => {
        setProdutoSelecionado(produto);
        setShowModalProduto(true);
    };

    const openLotes = (produto) => {
        setProdutoSelecionado(produto);
        setShowModalLotes(true);

    };



    const closeModalCategoria = () => {
        setShowModalCategoria(false)
    }

    const closeModalNewProduto = () => {
        setShowModalNewProduto(false)
    }

    const closeModalProduto = () => {
        setShowModalProduto(false)

    }

    const closeModalLotes = () => {
        setShowModalLotes(false)
    }


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
        <div className={styles.produtosContainer}>
            <div className={styles.header}>

                <div className={styles.searchContainer}>
                    <MagnifyingGlass className={styles.icon} />
                    <input
                        type="text"
                        placeholder="Pesquisar produto por nome"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />

                </div>

                <div className={styles.buttonSection}>


                    <div className={styles.filterWrapper}>
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
                                ))
                            }
                        </select>
                    </div>


                    <div>
                        <button onClick={openCategorias} className={styles.exportButton}>
                            Categorias

                        </button>
                        {showModalCategoria &&
                            <ModalCategorias
                                onClose={closeModalCategoria}
                                categorias={categorias}
                                getCategorias={getCategorias}
                                getProdutos={getProdutos}
                            />}
                    </div>

                    <div>
                        <button onClick={openNewProduto} className={styles.addButton}>
                            Inserir Produto
                        </button>
                        {showModalNewProduto &&
                            <NewProduto
                                onClose={closeModalNewProduto}
                                categorias={categorias}
                                getProdutos={getProdutos}
                            />}
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
                                    <button className={styles.profile} onClick={() => openProduto(item)}>
                                        Detalhes
                                    </button>
                                    {showModalProduto && produtoSelecionado && (
                                        <ModalProduto
                                            produto={produtoSelecionado}
                                            onClose={closeModalProduto}
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
                                <td>{item.valorVarejo}</td>
                                <td>{item.valorAtacado}</td>
                                <td>
                                    <button onClick={() => openLotes(item)}>
                                        {item.quantEstoque}
                                    </button>
                                    {showModalLotes && (
                                        <ModalLotes
                                            produto={produtoSelecionado}
                                            onClose={closeModalLotes}
                                            getProdutos={getProdutos}
                                        />
                                    )}
                                </td>

                            </tr>
                        ))}
                </tbody>
            </table>

            <ToastContainer/>
        </div>
    );
}
