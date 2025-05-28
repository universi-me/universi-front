export function UniversiFormHandleValidation<T>( validation: Optional<boolean>, valid: T, invalid: T ): Optional<T> {
    if ( validation === undefined ) return undefined;
    return validation ? valid : invalid;
}
