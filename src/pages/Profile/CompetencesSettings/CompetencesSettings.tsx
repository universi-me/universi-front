import { useContext, useMemo } from "react";

import { ProfileContext } from "@/pages/Profile";
import { CompetenceType, LevelToLabel } from "@/types/Competence";
import { UniversimeApi } from "@/services/UniversimeApi";
import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";

import './CompetencesSettings.less'

export function CompetencesSettings() {
    const profileContext = useContext(ProfileContext)
    const editCompetence = profileContext?.editCompetence ?? null;

    const competenceTypeOptions = useMemo(() => {
        return orderByName(profileContext?.allTypeCompetence ?? [])
    }, [profileContext?.allTypeCompetence]);

    function orderByName(competences : CompetenceType[]){
        return competences
            .slice()
            .sort((c1,c2) => c1.name.localeCompare(c2.name))
            .map((t)=> ({value: t.id, label: t.name})) ?? [];
    }

    return (
        profileContext &&
        <UniversiForm
            formTitle={editCompetence?.id ? "Editar competência" : "Adicionar competência"}
            objects={[
                {
                    DTOName: "competenceTypeId", label: "Tipo de Competência", type: FormInputs.SELECT_SINGLE, 
                    value: editCompetence?.competenceType ? {value: editCompetence?.competenceType.id, label: editCompetence?.competenceType.name } : undefined,
                    options: competenceTypeOptions,
                    required: true,
                    canCreate: true,
                    onCreate: (value: any) => UniversimeApi.CompetenceType.create({name: value}).then(response => {
                        if (response.success) {
                            // return updated competence types
                            return UniversimeApi.CompetenceType.list().then(response => {
                                if (response.success && response.body) {
                                    let options = orderByName(response.body.list)
                                    return options;
                                }
                            })
                        }
                    })
                },
                {
                    DTOName: "level", label: "Nível de Experiência", type: FormInputs.RADIO, 
                    value: editCompetence?.level ? {value: editCompetence?.level , label: editCompetence?.level } : undefined,
                    options: Object.entries(LevelToLabel).map(([level, label]) => ({value: level, label })),
                    required: true
                },
                {
                    DTOName: "description", label: "description", type: FormInputs.HIDDEN,
                    value: editCompetence?.description ?? ""
                },
                {
                    DTOName: "competenceId", label: "competenceId", type: FormInputs.HIDDEN,
                    value: editCompetence?.id
                }
            ]}
            requisition={ editCompetence?.id ? UniversimeApi.Competence.update : UniversimeApi.Competence.create }
            callback={()=>{ profileContext?.reloadPage() }}
        />
    );
    
}
