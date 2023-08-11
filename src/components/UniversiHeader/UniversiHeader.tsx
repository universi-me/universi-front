import { useContext } from "react";
import { Link } from "react-router-dom";
import UniversiLogo from '@/components/UniversiLogo'
import { AuthContext, AuthContextType } from "@/src/contexts/Auth/AuthContext";
import "./UniversiHeader.css"

export type UniversiHeaderProps = {
    // todo
};

export function UniversiHeader() {
    const authContext = useContext(AuthContext);
    const isLogged =    !!authContext?.user;

    return (
        <header id="universi-header">
            <div id="universi-header-first-half">
                <UniversiLogo />
                <nav>
                    {/* todo: current page has 'color:var(--secondary-color)'    */}
                    <Link to="/">Início</Link>
                    <Link to="/sobre">Sobre</Link>
                </nav>
            </div>

            <div id="universi-header-second-half">
                <form id="universi-header-search">
                    <input
                        type="search"
                        id="universi-header-search-bar"
                        placeholder="Pesquisar..."
                    />
                    <button type="submit" id="universi-header-search-button">
                        <img src="/assets/icons/search.svg" alt="Pesquisar" />
                    </button>
                </form>

                {
                    isLogged
                        ? <div className="welcome-message">{`Olá, ${authContext.user?.name}`}</div>
                        : null
                }
                { loginLogoutButton(authContext, isLogged) }
            </div>
        </header>
    );
}

/**
 * Renders the login button on the header and the user's name and profile
 * picture
 */
function loginLogoutButton(authContext: AuthContextType, isLogged: boolean) {
    return isLogged
        ? <button onClick={authContext?.signout} className="auth-button logout">Sair</button>
        : <Link to="/login" className="auth-button login">Entrar</Link>;
}
