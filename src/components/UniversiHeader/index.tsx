import UniversiLogo from "../../../public/assets/imgs/universi-me2.png";
import { SearchInput } from "./components/SearchInput";
import "./styles.css";

export function Header() {
  return (
    <header className="header">
      <div>
        <img src={UniversiLogo} alt="Logo universi.me" />
      </div>
      <nav>
        <a href="#">Início</a>
        <a href="#">Equipe</a>
        <a href="#">Sobre</a>
      </nav>
      <SearchInput />
    </header>
  );
}
