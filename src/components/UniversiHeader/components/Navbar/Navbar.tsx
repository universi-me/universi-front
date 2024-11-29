import { useContext } from "react"
import { Link } from "react-router-dom";

import { AuthContext } from "@/contexts/Auth";

import "./Navbar.less";

export default function Navbar() {
    return <nav>
        {
            NAVBAR_LINKS
                .filter(l => l.condition ? l.condition() : true)
                .map(l => {
                    return <Link to={l.to} key={l.to}>{l.title}</Link>
                })
        }
    </nav>
}

type NavbarLink = {
    title: string;
    to: string;

    condition?: () => boolean;
};

const NAVBAR_LINKS: NavbarLink[] = [
    { title: "Início", to: "/" },
    { title: "Sobre", to: "/sobre" },
    { title: "Capacitação", to: "/capacitacao", condition: () => !!useContext(AuthContext).user}, // must be logged in
];
