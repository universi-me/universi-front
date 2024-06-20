import { MouseEvent } from "react";

export function setStateAsValue<T>(setter: (value: T) => any) {
    return function(event: {currentTarget: {value: T}}) {
        setter(event.currentTarget.value);
    }
}

export function makeClassName(...names: (string | (string | undefined | false | null)[] | undefined | false | null)[]) {
    const flatNames = names.flat();
    return [...new Set(flatNames)]
        .filter(n => !!n)
        .join(" ");
}

export function deactivateButtonWhile<CallbackReturn>(callback: () => CallbackReturn, addClass?: string) {
    return function (e: MouseEvent<HTMLButtonElement>): CallbackReturn {
        const el = e.currentTarget;
        el.disabled = true;

        if (addClass) {
            if (el.classList.contains(addClass))
                // prevents from removing a class that was already there
                addClass = undefined;

            else
                el.classList.add(addClass);
        }

        const res = callback();

        return res instanceof Promise
            ? res.then(reactivate) as CallbackReturn
            : reactivate(res);

        function reactivate<T>(value: T) {
            el.disabled = false;

            if (addClass)
                el.classList.remove(addClass);

            return value;
        }
    }
}
