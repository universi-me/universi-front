type UniversiFormFieldProps<T> = {
    param: string;
    label?: React.ReactNode;

    disabled?: boolean;
    required?: boolean;

    defaultValue?: T;
    onChange?( value: T ): any;

    validations?: UniversiFormFieldValidation<T>[];
};

type UniversiFormFieldValidation<T> = ( v: T, form: Record<string, any> ) => Awaitable<boolean>;
