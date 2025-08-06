import MaterialIcon, { type MaterialIconProps } from "@/components/MaterialIcon";
import UniversiModal from "@/components/UniversiModal";
import { makeClassName } from "@/utils/tsxUtils";

import styles from "./LoadingSpinner.module.less";

export function LoadingSpinner( props: Readonly<LoadingSpinnerProps> ) {
    const { inline, className, noOverlay, ...iconProps } = props;

    const icon = <MaterialIcon
        { ...iconProps }
        icon="progress_activity"
        className={ makeClassName( styles.icon, ( inline || noOverlay ) && styles.inline, className ) }
    />;

    return inline
        ? icon
        : <UniversiModal contentProps={{ style: { overflow: "hidden" } }} overlayProps={{ style: { display: noOverlay === true ? 'none' : undefined } }}>
            {icon}
        </UniversiModal>;
}

export type LoadingSpinnerProps = {
    inline?: boolean;
    noOverlay?: boolean;
} & Omit<MaterialIconProps, "icon">;
