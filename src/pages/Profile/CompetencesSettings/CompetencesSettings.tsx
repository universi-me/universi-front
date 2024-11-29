import { useContext, useMemo } from "react";

import { ProfileContext } from "@/pages/Profile";
import { CompetenceType, Level, LevelToDescription, LevelToLabel } from "@/types/Competence";
import { UniversimeApi } from "@/services/UniversimeApi";
import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";

export function CompetencesSettings() {
    const profileContext = useContext(ProfileContext)
    const editCompetence = profileContext?.editCompetence ?? null;

    const competenceTypeOptions = useMemo(() => {
        return orderByName(availableCompetencesForAdd(profileContext?.allTypeCompetence ?? []));
    }, [profileContext?.allTypeCompetence]);

    //filtering the competence types that are not in the profile
    function availableCompetencesForAdd(competences : CompetenceType[]){
        return competences
            .filter((comp) => {
                return editCompetence?.competenceType.id === comp.id || !profileContext?.profileListData.competences.some((c) => c.competenceType.id === comp.id)
            }) ?? [];
    }

    function orderByName(competences : CompetenceType[]){
        return competences
            .slice()
            .sort((c1,c2) => c1.name.localeCompare(c2.name))
            .map((t)=> ({value: t.id, label: t.name})) ?? [];
    }

    const levelOptions = Object.entries(LevelToLabel)
        .map(([level]) => makeLevelOption(parseInt(level) as Level));

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
                    value: editCompetence?.level ? makeLevelOption(editCompetence.level) : undefined,
                    options: levelOptions, required: true
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
            callback={()=> {profileContext.reloadPage()} }
        />
    );

    function makeLevelOption(level: Level) {
        return {
            value: level,
            label: `${LevelToLabel[level]}: ${LevelToDescription[level]}`,
        };
    }
}
