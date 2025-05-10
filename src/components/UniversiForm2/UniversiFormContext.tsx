import { createContext } from "react";

export type UniversiFormContextType = {
    set( key: string, value: any ): Promise<void>;
    get( key: string ): any;
    del( key: string ): void;
    getValidation( key: string ): Optional<boolean>;
    initialize( key: string, value: any, validation: {
        functions?: UniversiFormFieldValidation<any>[];
        required?: boolean;
        setValid?: ( valid: Optional<boolean> ) => any;
    } ): () => void;
};

export const UniversiFormContext = createContext<Optional<UniversiFormContextType>>( undefined );
