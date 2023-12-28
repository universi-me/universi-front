import { useContext, useState } from "react";

import { ProfileContext } from "@/pages/Profile";
import { Level, LevelToLabel } from "@/types/Competence";
import { UniversimeApi } from "@/services/UniversimeApi";
import { deactivateButtonWhile, setStateAsValue } from "@/utils/tsxUtils";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";
import { TextValidation } from "@/components/UniversiForm/Validation/TextValidation";
import { ValidationComposite } from "@/components/UniversiForm/Validation/ValidationComposite";

import './CompetencesSettings.less'

export function CompetencesSettings() {
    const profileContext = useContext(ProfileContext)
    const editCompetence = profileContext?.editCompetence ?? null;

    const [competenceTypeId, setCompetenceTypeId] = useState<string>(editCompetence?.competenceType.id ?? "");
    const [competenceLevel, setCompetenceLevel] = useState<Level | "">(editCompetence?.level ?? "");
    const [description, setDescription] = useState<string>(editCompetence?.description ?? "");

    return (
        profileContext === null ? null :
        <UniversiForm
            formTitle={editCompetence?.id ? "Editar competência" : "Adicionar competência"}
            objects={[
                {
                    DTOName: "competenceTypeId", label: "Tipo de Competência", type: FormInputs.SELECT_SINGLE, 
                    value: competenceTypeId,
                    options: profileContext.allTypeCompetence.map((t) => ({value: t.id, label: t.name})),
                    required: true,
                },
                {
                    DTOName: "level", label: "Nível de Experiência", type: FormInputs.SELECT_SINGLE, 
                    value: competenceLevel,
                    options: Object.entries(LevelToLabel).map(([level, label]) => ({value: level, label })),
                    required: true
                },
                {
                    DTOName: "description", label: "description", type: FormInputs.HIDDEN, value: description
                },
                {
                    DTOName: "competenceId", label: "competenceId", type: FormInputs.HIDDEN, value: profileContext?.editCompetence?.id
                }
            ]}
            requisition={ editCompetence?.id ? UniversimeApi.Competence.update : UniversimeApi.Competence.create }
            callback={()=>{ profileContext?.reloadPage() }}
        />
    );
    
}
