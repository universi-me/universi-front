import { Dispatch, SetStateAction } from "react";

export function setStateAsValue<T>(setter: Dispatch<SetStateAction<T>>) {
    return function(event: {currentTarget: {value: T}}) {
        setter(event.currentTarget.value);
    }
}

export function makeClassName(...names: (string | (string | undefined)[] | undefined | false)[]) {
    const flatNames = names.flat();
    return [...new Set(flatNames)]
        .filter(n => !!n)
        .join(" ");
}
