import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { hasAvailableOption, OptionInMenu, renderOption } from "@/utils/dropdownMenuUtils";
import { makeClassName } from "@/utils/tsxUtils";

import styles from "./DropdownOptions.module.less";


export function DropdownOptions<T>( props: Readonly<DropdownOptionsProps<T>> ) {
    const { trigger, data } = props;

    if ( !hasAvailableOption( props.options, data ) )
        return null;

    const options = props.options.map( o => ({
        ...o,
        className: makeClassName( styles.option_item, o.className ),
    }));

    return <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
            { trigger }
        </DropdownMenu.Trigger>

        <DropdownMenu.Content side="top" className={ styles.content }>
            { options.map( o => renderOption( data, o ) ) }

            <DropdownMenu.Arrow height=".5rem" width="1rem" className={ styles.arrow }/>
        </DropdownMenu.Content>
    </DropdownMenu.Root>
}

export type DropdownOptionsProps<T> = {
    data: T;
    options: OptionInMenu<T>[];
    trigger: NonNullable<React.ReactNode>;
};
