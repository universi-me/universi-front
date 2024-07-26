import { HTMLAttributes } from "react";
import { HexColorPicker } from "react-colorful";

import { makeClassName } from "@/utils/tsxUtils";
import { GroupTheme, GroupThemeToLabel } from "@/types/Group";

import styles from "./ThemeBuilder.module.less";

export type ThemeBuilderProps = HTMLAttributes<HTMLTableSectionElement> & {
    currentTheme: GroupTheme;
    changeValue(key: keyof GroupTheme, value: string): any;
};

export function ThemeBuilder(props: Readonly<ThemeBuilderProps>) {
    const { changeValue, currentTheme, className, ...sectionProps } = props;

    return <section {...sectionProps} className={makeClassName(styles.themeBuilder, className)}>
        { Object.keys(GroupThemeToLabel).map(k => {
            const key = k as keyof GroupTheme;
            const name = GroupThemeToLabel[key];

            return <fieldset key={key} title={name}>
                <label className="color-name">{ name }</label>

                <HexColorPicker
                    color={currentTheme[key]}
                    onChange={e => changeValue(key, e)}
                    className="color-picker"
                />
            </fieldset>
        }) }
    </section>;
}
