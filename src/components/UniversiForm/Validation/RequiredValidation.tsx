import { Validation, ValidationParams } from "./Validation";

export class RequiredValidation implements Validation<any>{

    validate(required: boolean | undefined, value: any, params?: ValidationParams | undefined): boolean {
        if(!required)
            return true
        if(required && value != null && value != undefined)
            return true
        return false
    }

}