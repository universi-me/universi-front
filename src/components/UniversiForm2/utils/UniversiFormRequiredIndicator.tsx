import styles from "./UniversiFormUtils.module.less";

export function UniversiFormRequiredIndicator( props: Readonly<UniversiFormRequiredIndicatorProps> ) {
    if ( !props.required ) return null;

    return <span className={ styles.required_indicator } title="Este campo é obrigatório">*</span>;
}

export type UniversiFormRequiredIndicatorProps = {
    required: Optional<boolean>;
};
