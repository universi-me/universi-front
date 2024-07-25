import { ReactNode } from "react";

import { IMG_UNIVERSI_LOGO } from "@/utils/assets";
import "./ErrorPage.less"

export type ErrorPageProps = {
    title: NonNullable<ReactNode>;
    description: NonNullable<ReactNode>;

    hideBackToHome?: boolean;
};

export function ErrorPage(props: Readonly<ErrorPageProps>) {
    const { title, description, hideBackToHome } = props;

    return <div id="error-page">
        <img id="universi-logo" src={IMG_UNIVERSI_LOGO} alt="Universi.me" />

        <h1 id="error-title">{ title }</h1>
        <p id="error-description">{ description }</p>

        { hideBackToHome ||
            <a id="back-to-home" href="/">Voltar para página inicial</a>
        }
    </div>
}
