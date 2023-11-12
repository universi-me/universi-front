
import { setStateAsValue } from "@/utils/tsxUtils";
import "./Filter.less"

interface FilterProps{
    setter: React.Dispatch<React.SetStateAction<string>>,
    placeholderMessage : string
}

export function Filter({setter, placeholderMessage} : FilterProps){

    return(
        <div id="filter-wrapper">
            <i className="bi bi-search filter-icon"/>
            <input type="search" name="filter-groups" id="filter-groups" className="filter-input"
                onChange={setStateAsValue(setter)} placeholder={placeholderMessage}
            />
        </div>
    )

}