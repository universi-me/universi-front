import { ReactNode } from "react";
import { Link } from "react-router-dom";

export type SettingsTitleProps = {
    children: NonNullable<ReactNode>;
};

export function SettingsTitle({ children }: Readonly<SettingsTitleProps>) {
    return <div className="settings-title-wrapper settings-page-title">
        { location.pathname !== "/settings" && <Link to="/settings">
            <span className="bi bi-arrow-left" />
        </Link> }
        { children }
    </div>
}
