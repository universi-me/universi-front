import { minimumLength, upperAndLowerCase, numberOrSpecialChar } from "@/utils/passwordValidation"
import { isEmail } from "@/utils/regexUtils";

export function enableSignUp(username: string, email: string, password: string): boolean {
    const validPassword = minimumLength(password)
                          && upperAndLowerCase(password)
                          && numberOrSpecialChar(password);

    const validEmail = isEmail(email);

    return !!validPassword && !!username && validEmail;
}
