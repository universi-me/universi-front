
import { setStateAsValue } from "@/utils/tsxUtils";
import "./Filter.less"

interface FilterProps{
    setter: (value: string) => any,
    placeholderMessage : string
}

export function Filter({setter, placeholderMessage} : FilterProps){

    return(
        <div className="filter-component">
            <i className="bi bi-search filter-icon"/>
            <input type="search" className="filter-input"
                onChange={setStateAsValue(setter)} placeholder={placeholderMessage}
            />
        </div>
    )

}