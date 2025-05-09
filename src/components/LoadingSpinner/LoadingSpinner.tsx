import MaterialIcon, { type MaterialIconProps } from "@/components/MaterialIcon";
import UniversiModal from "@/components/UniversiModal";
import { makeClassName } from "@/utils/tsxUtils";

import styles from "./LoadingSpinner.module.less";

export function LoadingSpinner( props: Readonly<LoadingSpinnerProps> ) {
    const { asModal, className, ...iconProps } = props;

    const icon = <MaterialIcon
        { ...iconProps }
        icon="progress_activity"
        className={ makeClassName( styles.icon, asModal && styles.on_modal, className ) }
    />;

    return asModal
        ? <UniversiModal contentProps={{ style: { overflow: "hidden" } }}>{icon}</UniversiModal>
        : icon;
}

export type LoadingSpinnerProps = {
    asModal?: boolean;
} & Omit<MaterialIconProps, "icon">;
