import { useContext, useState } from "react";

import { ProfileContext } from "@/pages/Profile";
import { UniversimeApi } from "@/services/UniversimeApi";

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
                        if (response.success) {
                            // return updated institution
                            return UniversimeApi.Institution.listAll().then(response => {
                                if (response.success && response.body) {
                                    let options = response.body.list.map(t => ({ value: t.id, label: t.name }));
                                    return options;
                                }
                            })
                        }
                    })
                },
                {
                    DTOName: "typeEducationId", label: "Tipo de Formação", type: FormInputs.SELECT_SINGLE, 
                    value: profileContext?.editEducation?.typeEducation ? {value: profileContext?.editEducation?.typeEducation.id, label: profileContext?.editEducation?.typeEducation.name } : undefined,
                    options: profileContext.allTypeEducation.map((t) => ({value: t.id, label: t.name})),
                    required: true,
                    canCreate: true,
                    onCreate: (value: any) => UniversimeApi.TypeEducation.create({name: value}).then(response => {
                        if (response.success) {
                            // return updated type education
                            return UniversimeApi.TypeEducation.list().then(response => {
                                if (response.success && response.body) {
                                    let options = response.body.lista.map(t => ({ value: t.id, label: t.name }));
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
                    value: profileContext?.editEducation?.endDate,
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
                    value: profileContext?.editEducation?.presentDate ?? false
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


