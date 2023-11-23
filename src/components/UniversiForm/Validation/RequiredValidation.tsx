import { FormObject } from "../UniversiForm";
import { Validation } from "./Validation";

export class RequiredValidation implements Validation{

    validate(object : FormObject): boolean {
        if(!object.required)
            return true
        if(object.required && object.value != undefined && object.value.trim().length > 0)
            return true
        return false
    }

}