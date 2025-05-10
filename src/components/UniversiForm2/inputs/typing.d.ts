type UniversiFormFieldProps<T> = {
    param: string;
    label?: ReactNode;

    disabled?: boolean;
    required?: boolean;

    defaultValue?: T;
    onChange?( value: T ): any;

    validations?: UniversiFormFieldValidation<T>[];
};

type UniversiFormFieldValidation<T> = ( v: T ) => boolean | PromiseLike<boolean>;
