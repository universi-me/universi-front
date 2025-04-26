import { HTMLAttributes } from "react";
import { HexColorPicker } from "react-colorful";
import { HexColorInput } from "react-colorful";

import { makeClassName } from "@/utils/tsxUtils";
import { GroupThemeToLabel } from "@/utils/themeUtils";

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
            const { label, description } = GroupThemeToLabel[key];

            return <fieldset key={ key }>
                <div className={ styles.colorInfo }>
                    <h3>{ label }</h3>
                    { description && <p>{ description }</p> }
                </div>

                <div>
                    <HexColorPicker
                        color={currentTheme[key]}
                        onChange={e => changeValue(key, e)}
                        className={ styles.colorPicker }
                    />
                    <div className={ styles.colorPickerInputArea }>
                        <HexColorInput
                            color={currentTheme[key]}
                            onChange={e => changeValue(key, e)}
                            className={ styles.colorPickerInput }
                            prefixed
                        />
                    </div>
                </div>
            </fieldset>
        }) }
    </section>;
}
