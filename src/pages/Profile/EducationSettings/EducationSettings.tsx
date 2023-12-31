import { useContext, useState } from "react";

import { ProfileContext } from "@/pages/Profile";
import { UniversimeApi } from "@/services/UniversimeApi";

import './EducationSetting.less'
import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";

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
                    required: true
                },
                {
                    DTOName: "typeEducationId", label: "Tipo de Formação", type: FormInputs.SELECT_SINGLE, 
                    value: profileContext?.editEducation?.typeEducation ? {value: profileContext?.editEducation?.typeEducation.id, label: profileContext?.editEducation?.typeEducation.name } : undefined,
                    options: profileContext.allTypeEducation.map((t) => ({value: t.id, label: t.name})),
                    required: true
                },
                {
                    DTOName: "startDate", label: "Data de Inicio", type: FormInputs.DATE,
                    value: profileContext?.editEducation?.startDate,
                    required: true
                },
                {
                    DTOName: "endDate", label: "Data de Término", type: FormInputs.DATE,
                    value: profileContext?.editEducation?.endDate
                },
                {
                    DTOName: "presentDate", label: "Exercendo Atualmente", type: FormInputs.BOOLEAN,
                    value: profileContext?.editEducation?.presentDate ?? false
                },
                {
                    DTOName: "educationId", label: "educationId", type: FormInputs.HIDDEN,
                    value: profileContext?.editEducation?.id
                }
            ]}
            requisition={ profileContext?.editEducation?.id ? UniversimeApi.Education.update : UniversimeApi.Education.create }
            callback={()=>{ profileContext?.reloadPage() }}
        />
    );

}


