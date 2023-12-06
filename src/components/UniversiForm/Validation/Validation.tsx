import { FormObject } from "../UniversiForm";

export interface Validation<ValueType> {

    validate(object : FormObject<ValueType>): boolean;

}
