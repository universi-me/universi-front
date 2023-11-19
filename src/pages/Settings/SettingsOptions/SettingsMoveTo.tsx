import { ReactNode } from "react";
import { Link } from "react-router-dom";

export type SettingsMoveToProps = {
    title: NonNullable<ReactNode>;
    description?: ReactNode;
    to: string;
};

export function SettingsMoveTo(props: Readonly<SettingsMoveToProps>) {
    return <Link to={props.to} className="settings-option">
        <div className="settings-option-content">
            <div className="settings-option-info">
                <h2 className="settings-option-title">{ props.title }</h2>
                { props.description && <p className="settings-option-description">{ props.description }</p>}
            </div>

            <span className="bi bi-arrow-right" />
        </div>
    </Link>
}
