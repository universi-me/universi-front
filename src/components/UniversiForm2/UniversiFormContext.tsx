import { createContext } from "react";

export type UniversiFormContextType = {
    set( key: string, value: any ): Promise<void>;
    get( key: string ): any;
    del( key: string ): void;
    getValidation( key: string ): Optional<boolean>;
    setValidations( key: string, options: {
        validations?: UniversiFormFieldValidation<any>[];
        required?: boolean;
    } ): Promise<void>;
};

export const UniversiFormContext = createContext<Optional<UniversiFormContextType>>( undefined );
