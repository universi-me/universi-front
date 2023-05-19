import { Component, ReactElement } from "react";
import './css/UniversiLogo.css'

export type UniversiLogoProps = {
    // todo
}

export default class UniversiLogo extends Component {
    constructor( props: UniversiLogoProps ) {
        super(props);
    }

    render() {
        return (
            <div className="universi-logo">
                {/* todo: change to the image of the logo */}
                <div className="universi-image" />
                <div className="universi-name">UNIVERSI.ME</div>
            </div>
        );
    }
}
