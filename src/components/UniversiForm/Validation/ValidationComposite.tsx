import { FormInputs, FormObject } from "../UniversiForm";
import { Validation } from "./Validation";

export class ValidationComposite<ValueType> {
    private validations: Validation<ValueType>[];

    constructor() {
      this.validations = [];
    }

    addValidation(validation : Validation<ValueType>) {
        this.validations.push(validation);
        return this;
    }

    validate(object : FormObject<any>) {
        for(const v of this.validations) {
            const isValid = v.validate(object);
            if (!isValid) return false;
        }

        return true;
    }

    static generate(type: FormInputs) {
      if (type === FormInputs.TEXT || type === FormInputs.LONG_TEXT || type === FormInputs.URL) {
         return new ValidationComposite<string>();
      }

      if (type === FormInputs.FILE || type === FormInputs.IMAGE) {
         return new ValidationComposite<File>();
      }

      if (type === FormInputs.NUMBER) {
         return new ValidationComposite<number>();
      }

      if (type === FormInputs.BOOLEAN) {
         return new ValidationComposite<boolean>();
      }

      return new ValidationComposite<any>();
    }
}
