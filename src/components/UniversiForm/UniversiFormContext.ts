import { createContext } from "react";

export type UniversiFormContextProps = {
    addParam( name: string, getter: () => any ): void;
    getParamValue( name: string ): any;
};

export const UniversiFormContext = createContext<UniversiFormContextProps | undefined>( undefined );
