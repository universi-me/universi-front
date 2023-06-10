import { Component, ReactElement, ReactNode } from "react";
import UniversiLogo from '@/components/UniversiLogo'
import "./UniversiHeader.css"

export type UniversiHeaderProps = {
    // todo
}

export class UniversiHeader extends Component {
    constructor( props: UniversiHeaderProps ) {
        super(props);
    }

    render(): ReactNode {
        return (
            <header id="universi-header">
                <div id="universi-header-first-half">
                    <UniversiLogo />
                    <nav>
                        {/* todo: links to other pages */}
                        {/* todo: current page has 'color:var(--secondary-color)'    */}
                        <a href="">Início</a>
                        <a href="">Equipe</a>
                        <a href="">Sobre</a>
                    </nav>
                </div>

                <div id="universi-header-second-half">
                    <form id="universi-header-search">
                        <input type="search" id="universi-header-search-bar" placeholder="Pesquisar..." />
                        <button type="submit" id="universi-header-search-button">
                            <img src="/assets/icons/search.svg" alt="Pesquisar" />
                        </button>
                    </form>
                    { loginElement() }
                </div>

            </header>
        );
    }
}

/**
 * Renders the login button on the header and the user's name and profile
 * picture
 */
function loginElement(): ReactElement {
    return (
        // todo: show "Olá, {user.nome}" and profile picture if user is logged
        <a className="login-button" href="">
            Entrar {/* todo: change to "Sair" if user is logged */}
        </a>
    );
}
