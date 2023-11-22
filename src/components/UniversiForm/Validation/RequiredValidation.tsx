import { FormObject } from "../UniversiForm";
import { Validation } from "./Validation";

export class RequiredValidation implements Validation{

    validate(object : FormObject): boolean {
        if(!object.required)
            return true
        if(object.required && (object.value != null || object.value != undefined))
            return true
        return false
    }

}