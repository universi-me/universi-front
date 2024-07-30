import { GroupTheme } from "@/types/Group";
import { makeClassName } from "@/utils/tsxUtils";

export type ThemeColorItemProps = {
    theme: GroupTheme;
    isSelected: boolean;
    onClick: (theme: GroupTheme) => any;
}

export function ThemeColorItem(props: Readonly<ThemeColorItemProps>) {
    const { theme, isSelected, onClick } = props;

    return <button
        className={makeClassName("theme-color-item", isSelected && "selected")}
        style={{
            backgroundColor: theme.primaryColor,
            borderColor: `${theme.secondaryColor} ${theme.tertiaryColor} ${theme.tertiaryColor} ${theme.secondaryColor}`,
            outline: 'solid 2px white'
        }}
        onClick={ e => onClick(theme) }
    />;
}
