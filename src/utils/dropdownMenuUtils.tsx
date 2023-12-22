import { ReactNode } from "react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export type OptionInMenu<T> = {
    text:       NonNullable<ReactNode>;
    biIcon?:    string;
    className?: string;

    onSelect?: (data: T) => any;
    disabled?: (data: T) => boolean;
    hidden?:   (data: T) => boolean;
};

export function renderOption<T>(data: T, option: OptionInMenu<T>) {
    if (isHidden(option, data))
        return null;

    const className = "dropdown-options-item" + (option.className ? ` ${option.className}` : "");
    const disabled = isDisabled(option, data);
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

export function hasAvailableOption<T>(options: OptionInMenu<T>[], data: T) {
    return undefined !== options
        .find(o => !isDisabled(o, data) && !isHidden(o, data));
}

function isHidden<T>(option: OptionInMenu<T>, data: T) {
    return option.hidden ? option.hidden(data) : false;
}

function isDisabled<T>(option: OptionInMenu<T>, data: T) {
    return option.disabled ? option.disabled(data) : false;
}
