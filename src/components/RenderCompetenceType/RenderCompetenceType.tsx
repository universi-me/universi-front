import BootstrapIcon from "@/components/BootstrapIcon";

export function RenderCompetenceType( props: Readonly<RenderCompetenceTypeProps> ) {
    const { competenceType, ...spanProps } = props;

    return <span { ...spanProps }>
        { competenceType.name }
        { competenceType.reviewed || <BootstrapIcon
            icon="exclamation-diamond-fill"
            title="Esta competência não foi revisada por um administrador e não é visível publicamente"
        /> }
    </span>
}

export type RenderCompetenceTypeProps = {
    competenceType: Competence.Type;
} & React.HTMLAttributes<HTMLSpanElement>;
