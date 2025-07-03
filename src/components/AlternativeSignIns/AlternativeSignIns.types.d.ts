namespace AlternativeSignIns {
    export type Props = {
        environment: Nullable<Group.Settings["environment"]>;

        topDivider?: DividerProps;
        bottomDivider?: DividerProps;
    } & React.HTMLAttributes<HTMLDivElement>;

    export type DividerProps = {
        text: string;
        color: string;
    } & React.HTMLAttributes<HTMLDivElement>;
}
