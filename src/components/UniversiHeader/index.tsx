import { Link } from "react-router-dom";
import { SearchInput } from "./components/SearchInput";
import { WelcomeUser } from "./components/WelcomeUser/WelcomeUser";
import { LoginButton } from "./components/LoginButton/LoginButton";
import Navbar from "./components/Navbar/Navbar";
import "./styles.less";

export function Header() {
  return (
    <header id="header">
      <Link to="/" id="header-logo">
        Universi<span className="tld">.me</span>
      </Link>
      <div className="right-items">
        <WelcomeUser />
        <LoginButton />
      </div>
    </header>
  );
}
