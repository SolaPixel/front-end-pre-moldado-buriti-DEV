// Componente Pai
import { Produtos } from "./components/Produtos";
import { Header } from "./components/Header";
// import { Infoprofile } from "./components/Infoprofile";
// import { Sidebar } from "./components/Sidebar";
import styles from "./Home.module.css";
import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

// import { Routes, Route, useLocation } from "react-router-dom";
import { api } from "./lib/axios";

export function Home() {
  //objeto que armazena produtos que vem da api
  const [produtos, setProdutos] = useState([]);

  //requisição para api buscar produtos
  async function getProdutos() {
    const response = await api.get("allProdutos");

    setProdutos(response.data.produtos);
  }

  useEffect(() => {
    getProdutos();
  }, []);

  //componente home
  return (
    <div>
      <Header />
      <div className={styles.container}>
        {/* em breve: grafico + relatorio */}
        {/* <div className={styles.wrapper}>
          <Sidebar />
          <main>
            <Infoprofile />
          </main>
        </div> */}

        <Produtos //tabela de produtos
          produtos={produtos}
          getProdutos={getProdutos}
        />
      </div>

      {/* <ToastContainer
            /> */}
    </div>
  );
}
