import { Link } from "react-router-dom";
import { IMG_UNIVERSI_LOGO } from "@/utils/assets";
import { SearchInput } from "./components/SearchInput";
import { WelcomeUser } from "./components/WelcomeUser/WelcomeUser";
import { LoginButton } from "./components/LoginButton/LoginButton";
import Navbar from "./components/Navbar/Navbar";
import "./styles.css";

export function Header() {
  return (
    <header className="header">
      <Link to="/">
        <img src={IMG_UNIVERSI_LOGO} alt="Logo universi.me" />
      </Link>
      <Navbar />
      <div className="right-items">
        {/* <SearchInput /> */}
        <WelcomeUser />
        <LoginButton />
      </div>
    </header>
  );
}
