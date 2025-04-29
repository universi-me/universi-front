import { createContext } from "react";

export type UniversiFormContextType = {
    set( key: string, value: any ): void;
    get( key: string ): unknown;
    del( key: string ): void;
};

export const UniversiFormContext = createContext<Optional<UniversiFormContextType>>( undefined );
