import { useContext, useState } from "react";

import { ProfileContext } from "@/pages/Profile";
import { UniversimeApi } from "@/services/UniversimeApi";
import * as SwalUtils from "@/utils/sweetalertUtils";

import './ExperienceSetting.less'
import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";

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
                    value: profileContext?.editExperience?.description as string,
                    required: true
                },
                {
                    DTOName: "local", label: "Local", type: FormInputs.LONG_TEXT,
                    value: profileContext?.editExperience?.local as string,
                    charLimit: 30,
                    required: true
                },
                {
                    DTOName: "startDate", label: "Data de Inicio", type: FormInputs.DATE,
                    value: profileContext?.editExperience?.startDate as string,
                    required: true
                },
                {
                    DTOName: "endDate", label: "Data de Término", type: FormInputs.DATE,
                    value: profileContext?.editExperience?.endDate as string
                },
                {
                    DTOName: "presentDate", label: "Exercendo Atualmente", type: FormInputs.BOOLEAN,
                    value: profileContext?.editExperience?.presentDate as boolean | undefined ?? false
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

    function removeEducation() {
        if (!profileContext || !profileContext.editEducation)
            return;

        UniversimeApi.Competence.remove({competenceId: profileContext.editEducation.id})
            .then((r) => {
                if (!r.success)
                    throw new Error(r.message);

                profileContext?.reloadPage();
            }).catch((reason: Error) => {
                SwalUtils.fireModal({
                    title: "Erro ao remover a Formação",
                    text: reason.message,
                    icon: "error",
                })
            });
    }

    function discardExperience() {
        if (!profileContext)
            return;

        SwalUtils.fireModal({
            showCancelButton: true,
            showConfirmButton: true,

            title : profileContext?.editExperience == null ? "Descartar formação?" : "Descartar alterações?",
            text: "Tem certeza? Esta ação é irreversível", 
            confirmButtonText: "Sim",
            cancelButtonText: "Não"
        }).then((value) => {
            if (value.isConfirmed) {
                profileContext.setEditExperience(undefined);
            }
        });
    }
}


