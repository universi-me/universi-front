import { Component } from "react";
import './UniversiLogo.css'

export type UniversiLogoProps = {
    // todo
}

export class UniversiLogo extends Component {
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
