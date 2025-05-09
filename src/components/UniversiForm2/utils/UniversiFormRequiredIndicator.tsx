import styles from "./UniversiFormUtils.module.less";

export function UniversiFormRequiredIndicator( props: Readonly<UniversiFormRequiredIndicatorProps> ) {
    if ( !props.required ) return null;

    const title = props.hideTitle ? undefined : "Este campo é obrigatório";

    return <span className={ styles.required_indicator } title={title}>*</span>;
}

export type UniversiFormRequiredIndicatorProps = {
    required: Optional<boolean>;
    hideTitle?: boolean;
};
