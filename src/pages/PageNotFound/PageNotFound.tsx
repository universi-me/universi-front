import { IMG_UNIVERSI_LOGO } from "@/utils/assets"
import "./PageNotFound.less"

export default function PageNotFound() {
    return <div id="page-not-found">
        <img id="universi-logo" src={IMG_UNIVERSI_LOGO} alt="Universi.me" />

        <h1 id="title-not-found">A página que você solicitou não foi encontrada</h1>
        <p id="desc-not-found">Pedimos desculpas pelo acontecido, mas não conseguimos encontrar a página solicitada.</p>
        <a id="back-to-home" href="/">Voltar para página inicial</a>
    </div>
}
