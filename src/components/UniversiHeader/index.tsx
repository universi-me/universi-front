import { Link } from "react-router-dom";
import UniversiLogo from "../../../public/assets/imgs/universi-me2.png";
import { SearchInput } from "./components/SearchInput";
import { LoginButton } from "./components/LoginButton/LoginButton";
import "./styles.css";

export function Header() {
  return (
    <header className="header">
      <Link to="/">
        <img src={UniversiLogo} alt="Logo universi.me" />
      </Link>
      <nav>
        <Link to="/">Início</Link>
        <Link to="/sobre">Sobre</Link>
      </nav>
      <SearchInput />
      <LoginButton />
    </header>
  );
}
