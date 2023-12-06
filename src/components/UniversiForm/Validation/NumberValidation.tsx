import { FormObjectNumber } from "../UniversiForm";
import { Validation } from "./Validation";

export class NumberValidation implements Validation<number> {
    validate(object: FormObjectNumber) {
        if(!object.value)
            return false
        if((object.maxValue && object.value > object.maxValue) || (object.minValue && object.value < object.minValue))
            return false;
        return true;
    }
}
