import { NullableBoolean } from "@/types/utils";

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

export function passwordValidationClass(validPassword: NullableBoolean): string {
    if (validPassword === null)
        return "";

    else if (validPassword)
        return SUCCESS_VALIDATION_CLASS;

    else
        return FAIL_VALIDATION_CLASS;
}
