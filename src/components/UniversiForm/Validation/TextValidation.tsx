import { FormInputs, FormObjectText } from "../UniversiForm";
import { RequiredValidation } from "./RequiredValidation";
import { Validation } from "./Validation";

export class TextValidation implements Validation<string> {

    validate(object: FormObjectText): boolean {
        if(!object.value)
            return false

        if(object.charLimit && object.value.length > object.charLimit)
            return false

        if(object.value.trim().length == 0)
            return false

        return true;
    }
}
