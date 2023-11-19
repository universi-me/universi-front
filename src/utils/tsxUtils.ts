import { Dispatch, SetStateAction } from "react";

export function setStateAsValue(setter: Dispatch<SetStateAction<string>>) {
    return function(event: {currentTarget: {value: string}}) {
        setter(event.currentTarget.value);
    }
}

export function makeClassName(...names: (string | (string | undefined)[] | undefined)[]) {
    const flatNames = names.flat();
    return [...new Set(flatNames)]
        .filter(n => !!n)
        .join(" ");
}
