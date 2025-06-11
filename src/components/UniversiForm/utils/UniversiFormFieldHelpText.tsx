import BootstrapIcon from "@/components/BootstrapIcon";
import { makeClassName } from "@/utils/tsxUtils";
import styles from "./UniversiFormUtils.module.less";

export function UniversiFormFieldHelpText( props: Readonly<UniversiFormFieldHelpTextProps> ) {
    if ( !props.children || typeof props.children === "boolean" )
        return null;

    if ( Array.isArray( props.children ) ) {
        const { children, ...elementProps } = props;
        return <>
            { children.map( c => <UniversiFormFieldHelpText { ...elementProps }>
                { c }
            </UniversiFormFieldHelpText> ) }
        </>
    }

    const { className, ...elementProps } = props;
    return <p { ...elementProps } className={ makeClassName( styles.help_text, className ) }>
        <BootstrapIcon icon="question-circle" /> { props.children }
    </p>
}

export type UniversiFormFieldHelpTextProps = React.PropsWithChildren<React.HTMLAttributes<HTMLParagraphElement>>;
