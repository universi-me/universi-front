import { Link } from "react-router-dom";
import { SearchInput } from "./components/SearchInput";
import { WelcomeUser } from "./components/WelcomeUser/WelcomeUser";
import { LoginButton } from "./components/LoginButton/LoginButton";
import "./styles.less";
import { useContext } from "react";
import { AuthContext } from "@/contexts/Auth";

export function Header() {

  const authContext = useContext(AuthContext)

  const link = authContext == null ? "/" : (authContext.profile?.organization == null ? "/profile/"+authContext.user?.name : "/group"+authContext.profile?.organization.path);

  return (
    <header id="header">
      <Link to={`${link}`} id="header-logo">
        Universi<span className="tld">.me</span>
      </Link>
      <div className="right-items">
        <WelcomeUser />
        <LoginButton />
      </div>
    </header>
  );
}
