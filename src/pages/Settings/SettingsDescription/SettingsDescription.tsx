import { PropsWithChildren } from "react";

export type SettingsDescriptionProps = PropsWithChildren<{}>;

export function SettingsDescription(props: SettingsDescriptionProps) {
    return <p className="settings-description">{ props.children }</p>
}
