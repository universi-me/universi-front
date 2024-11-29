import { FormObject } from "../UniversiForm";
import { Validation } from "./Validation";

export class RequiredValidation implements Validation<any> {
    validate(object : FormObject<any>): boolean {
        if(!object.required)
            return true

        if (object.value === undefined || object.value === null || object.value?.length === 0)
            return false;

        return true;
    }
}
