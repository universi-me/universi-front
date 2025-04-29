type UniversiFormFieldProps<T> = {
    param: string;
    label?: ReactNode;

    disabled?: boolean;
    required?: boolean;

    defaultValue?: T;
    onChange?( value: T ): any;
};

type UniversiFormFieldPropsMergeWith<T, E> = UniversiFormFieldProps<T>
    & Omit<E, keyof UniversiFormFieldProps<T>>;
