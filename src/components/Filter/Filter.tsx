import { type HTMLAttributes } from "react";
import { makeClassName, setStateAsValue } from "@/utils/tsxUtils";
import "./Filter.less"

interface FilterProps extends HTMLAttributes<HTMLDivElement> {
    setter: (value: string) => any,
    placeholderMessage : string;
}

export function Filter( props: Readonly<FilterProps> ) {
    const { setter, placeholderMessage, className, ...divAttributes } = props;

    return(
        <div { ...divAttributes } className={ makeClassName( "filter-component", className ) }>
            <i className="bi bi-search filter-icon"/>
            <input type="search" className="filter-input"
                onChange={setStateAsValue(setter)} placeholder={placeholderMessage}
            />
        </div>
    )

}