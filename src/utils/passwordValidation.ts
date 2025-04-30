const MINIMUM_PASSWORD_LENGTH = 8;

const FAIL_VALIDATION_CLASS =    "failed-validation";
const SUCCESS_VALIDATION_CLASS = "success-validation";

export function minimumLength(password: string): NullableBoolean {
    if (!password)
        return null;

    return password.length >= MINIMUM_PASSWORD_LENGTH;
}

export function upperAndLowerCase(password: string): NullableBoolean {
    if (!password)
        return null;

    return RegExp(/[A-Z]/).exec(password) !== null && RegExp(/[a-z]/).exec(password) !== null;
}

export function numberOrSpecialChar(password: string): NullableBoolean {
    if (!password)
        return null;

    return RegExp(/[^A-Za-zçÇ]/).exec(password) !== null;
}

export function equality(password: string, passwordRepeat: string): NullableBoolean {
    if (((password == null || password.length==0) || (passwordRepeat == null || passwordRepeat.length==0)))
        return null;

    return (password === passwordRepeat);
}

export class PasswordValidity {
    constructor( public password: string, public passwordRepeat?: string ) {}

    get length(): NullableBoolean { return minimumLength( this.password ); }
    get case(): NullableBoolean { return upperAndLowerCase( this.password ); }
    get special(): NullableBoolean { return numberOrSpecialChar( this.password ); }
    get confirm(): Possibly<boolean> {
        return this.passwordRepeat !== undefined
            ? equality( this.password, this.passwordRepeat )
            : undefined;
    }

    get allValid(): boolean {
        const confirm = this.confirm;

        return !!this.length
            && !!this.case
            && !!this.special
            && ( confirm || confirm === undefined );
    }
};

export function passwordValidationClass(validPassword: NullableBoolean): string {
    if (validPassword === null)
        return "";

    else if (validPassword)
        return SUCCESS_VALIDATION_CLASS;

    else
        return FAIL_VALIDATION_CLASS;
}
