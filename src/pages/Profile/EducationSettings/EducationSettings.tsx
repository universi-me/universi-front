import { useContext, useState } from "react";

import { ProfileContext } from "@/pages/Profile";
import { UniversimeApi } from "@/services";

import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";
import { ValidationComposite } from "@/components/UniversiForm/Validation/ValidationComposite";

export function EducationSettings() {
    const profileContext = useContext(ProfileContext)

    return (
        profileContext &&
        <UniversiForm
            formTitle={profileContext?.editEducation?.id ? "Editar Formação" : "Adicionar Formação"}
            objects={[
                {
                    DTOName: "institutionId", label: "Insituição", type: FormInputs.SELECT_SINGLE, 
                    value: profileContext?.editEducation?.institution ? {value: profileContext?.editEducation?.institution.id, label: profileContext?.editEducation?.institution.name } : undefined,
                    options: profileContext.allInstitution.map((t) => ({value: t.id, label: t.name})),
                    required: true,
                    canCreate: true,
                    onCreate: (value: any) => UniversimeApi.Institution.create({name: value}).then(response => {
                        if (response.isSuccess()) {
                            // return updated institution
                            return UniversimeApi.Institution.list().then(response => {
                                if (response.isSuccess() && response.body) {
                                    let options = response.data.map(t => ({ value: t.id, label: t.name }));
                                    return options;
                                }
                            })
                        }
                    })
                },
                {
                    DTOName: "typeEducationId", label: "Tipo de Formação", type: FormInputs.SELECT_SINGLE, 
                    value: profileContext?.editEducation?.educationType ? {value: profileContext?.editEducation?.educationType.id, label: profileContext?.editEducation?.educationType.name } : undefined,
                    options: profileContext.allTypeEducation.map((t) => ({value: t.id, label: t.name})),
                    required: true,
                    canCreate: true,
                    onCreate: (value: any) => UniversimeApi.EducationType.create({name: value}).then(response => {
                        if (response.isSuccess()) {
                            // return updated type education
                            return UniversimeApi.EducationType.list().then(response => {
                                if (response.isSuccess() && response.body) {
                                    let options = response.data.map(t => ({ value: t.id, label: t.name }));
                                    return options;
                                }
                            })
                        }
                    })
                },
                {
                    DTOName: "startDate", label: "Data de Inicio", type: FormInputs.DATE,
                    value: profileContext?.editEducation?.startDate,
                    required: true
                },
                {
                    DTOName: "endDate", label: "Data de Término", type: FormInputs.DATE,
                    value: profileContext?.editEducation?.endDate ?? undefined,
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
                    DTOName: "presentDate", label: "Em andamento", type: FormInputs.BOOLEAN,
                    value: profileContext?.editEducation?.endDate === null
                },
                {
                    DTOName: "educationId", label: "educationId", type: FormInputs.HIDDEN,
                    value: profileContext?.editEducation?.id
                }
            ]}
            requisition={ profileContext?.editEducation?.id ? UniversimeApi.Education.update : UniversimeApi.Education.create }
            callback={async()=> await profileContext?.reloadPage() }
        />
    );

}


