import styles from "./Header.module.css";

import Logo from "../assets/Logo.svg";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={Logo} alt="pré-moldado-buriti" />
        <h3>PRÉ MOLDADO BURITI</h3>
      </div>
      {/* navegação */}
      <div className={styles.navigate}>
        <button>Home</button>
        <button>Orçamentos</button>
        <button>Clientes</button>
      </div>
      {/* adicionar função de navegação de paginas */}
    </header>
  );
}
