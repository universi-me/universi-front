import MaterialIcon, { type MaterialIconProps } from "@/components/MaterialIcon";
import UniversiModal from "@/components/UniversiModal";
import { makeClassName } from "@/utils/tsxUtils";

import styles from "./LoadingSpinner.module.less";

export function LoadingSpinner( props: Readonly<LoadingSpinnerProps> ) {
    const { inline, className, ...iconProps } = props;

    const icon = <MaterialIcon
        { ...iconProps }
        icon="progress_activity"
        className={ makeClassName( styles.icon, inline && styles.inline, className ) }
    />;

    return inline
        ? icon
        : <UniversiModal contentProps={{ style: { overflow: "hidden" } }}>{icon}</UniversiModal>;
}

export type LoadingSpinnerProps = {
    inline?: boolean;
} & Omit<MaterialIconProps, "icon">;
