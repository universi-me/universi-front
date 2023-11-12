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
    if (option.hidden)
        return null;

    const className = "content-options-item" + (option.className ? ` ${option.className}` : "");
    const disabled = option.disabled ? option.disabled() : undefined;
    const key = option.text.toString();
    const onSelect = function() {
        return !disabled && option.onSelect
            ? option.onSelect(data)
            : undefined;
    };

    return <DropdownMenu.Item {...{className, disabled, onSelect, key}}>
        { option.text }
        { option.biIcon ? <i className={`bi bi-${option.biIcon} right-slot`}/> : null }
    </DropdownMenu.Item>
}
