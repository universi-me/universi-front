import { ReactNode } from "react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export type OptionInMenu<T> = {
    text:       NonNullable<ReactNode>;
    biIcon?:    string;
    className?: string;

    onSelect?: (data: T) => any;
    disabled?: () => boolean;
    hidden?:   () => boolean;
};

export function renderOption<T>(data: T, option: OptionInMenu<T>) {
    if (isHidden(option))
        return null;

    const className = "dropdown-options-item" + (option.className ? ` ${option.className}` : "");
    const disabled = isDisabled(option);
    const key = option.text.toString();
    const onSelect = function() {
        if (!disabled && option.onSelect)
            option.onSelect(data);
    };

    return <DropdownMenu.Item {...{className, disabled, onSelect, key}}>
        { option.text }
        { option.biIcon ? <i className={`bi bi-${option.biIcon} right-slot`}/> : null }
    </DropdownMenu.Item>
}

export function hasAvailableOption(options: OptionInMenu<any>[]) {
    return undefined !== options
        .find(o => !isDisabled(o) && !isHidden(o));
}

function isHidden(option: OptionInMenu<any>) {
    return option.hidden ? option.hidden() : false;
}

function isDisabled(option: OptionInMenu<any>) {
    return option.disabled ? option.disabled() : false;
}
