import { FormInputs, FormObject } from "../UniversiForm";
import { Validation} from "./Validation";

export class TextValidation implements Validation{

    validate(object: FormObject): boolean {
        if(!object.required)
            return true;
        if(!object.value)
            return false
        if(object.charLimit && object.value.length > object.charLimit)
            return false
        if(object.value.trim().length == 0)
            return false
        return true;
    }

}