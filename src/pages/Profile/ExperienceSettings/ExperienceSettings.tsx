import { useContext, useState } from "react";

import { ProfileContext } from "@/pages/Profile";
import { UniversimeApi } from "@/services/UniversimeApi"

import './ExperienceSetting.less'
import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";
import { ValidationComposite } from "@/components/UniversiForm/Validation/ValidationComposite";

export function ExperienceSettings() {
    const profileContext = useContext(ProfileContext)

    return (
        profileContext &&
        <UniversiForm
            formTitle={profileContext?.editExperience?.id ? "Editar Experiência" : "Adicionar Experiência"}
            objects={[
                {
                    DTOName: "typeExperienceId", label: "Tipo de Experiência", type: FormInputs.SELECT_SINGLE, 
                    value: profileContext?.editExperience?.typeExperience ? {value: profileContext?.editExperience?.typeExperience.id, label: profileContext?.editExperience?.typeExperience.name } : undefined,
                    options: profileContext.allTypeExperience.map((t) => ({value: t.id, label: t.name})),
                    required: true
                },
                {
                    DTOName: "description", label: "Descrição", type: FormInputs.LONG_TEXT,
                    value: profileContext?.editExperience?.description,
                    required: true
                },
                {
                    DTOName: "local", label: "Local", type: FormInputs.LONG_TEXT,
                    value: profileContext?.editExperience?.local,
                    charLimit: 30,
                    required: true
                },
                {
                    DTOName: "startDate", label: "Data de Inicio", type: FormInputs.DATE,
                    value: profileContext?.editExperience?.startDate,
                    required: true
                },
                {
                    DTOName: "endDate", label: "Data de Término", type: FormInputs.DATE,
                    value: profileContext?.editExperience?.endDate,
                    disabled: (objects) => objects.find((obj) => obj.DTOName == "presentDate")?.value ?? false,
                    validation: new ValidationComposite<any>().addValidation({
                        validate(object: any, objects: any[]) {
                            const endDateDisabled = objects.find((obj) => obj.DTOName == "presentDate")?.value ?? false
                            if(endDateDisabled) {
                                return true;
                            } else if (!object.value) {
                                return false;
                            }
                            // check if start date is before end date
                            const startDate = objects.find((obj) => obj.DTOName == "startDate")?.value
                            const endDate = object.value 
                            if (startDate && endDate) {
                                if (startDate > endDate) {
                                    return false;
                                }
                            }
                            return true;
                        }
                    })
                },
                {
                    DTOName: "presentDate", label: "Exercendo Atualmente", type: FormInputs.BOOLEAN,
                    value: profileContext?.editExperience?.presentDate ?? false
                },
                {
                    DTOName: "profileExperienceId", label: "profileExperienceId", type: FormInputs.HIDDEN,
                    value: profileContext?.editExperience?.id
                }
            ]}
            requisition={ profileContext?.editExperience?.id ? UniversimeApi.Experience.update : UniversimeApi.Experience.create }
            callback={()=>{ profileContext?.reloadPage() }}
        />
    );

}


