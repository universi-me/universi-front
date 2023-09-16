import { Dispatch, SetStateAction } from "react";

export function setStateAsValue(setter: Dispatch<SetStateAction<string>>) {
    return function(event: {currentTarget: {value: string}}) {
        setter(event.currentTarget.value);
    }
}
