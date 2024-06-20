import { useContext, useMemo } from "react";

import { ProfileContext } from "@/pages/Profile";
import { CompetenceType, Level, LevelToDescription, LevelToLabel } from "@/types/Competence";
import { UniversimeApi } from "@/services/UniversimeApi";

import './CompetencesSettings.less'
import { UniversiForm2 } from "@/components/UniversiForm/UniversiForm2";
import { SelectSingle } from "@/components/UniversiForm/Presets/SelectSingle";
import stringUtils from "@/utils/stringUtils";
import { Hidden } from "@/components/UniversiForm/Presets/Hidden";

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
            // .map((t)=> ({value: t.id, label: t.name}))
            ?? [];
    }

    const levelOptions = Object.entries(LevelToLabel)
        .map(([level]) => makeLevelOption(parseInt(level) as Level));

    return (
        profileContext &&
        <UniversiForm2 asModal title={editCompetence?.id ? "Editar competência" : "Adicionar competência"}
            requisition={ editCompetence?.id ? UniversimeApi.Competence.update : UniversimeApi.Competence.create }
            callBack={ () => profileContext.reloadPage() }
        >
            <SelectSingle param="competenceTypeId" label="Tipo de Competência"
                defaultObject={ editCompetence?.competenceType } options={competenceTypeOptions} required
                getLabel={ ct => ct.name } getValue={ ct => ct.id }
                createValue={ handleCreateCompetenceType }
            />

            {/* level */}

            <Hidden param="description" defaultObject={ editCompetence?.description ?? "" } />
            <Hidden param="competenceId" defaultObject={ editCompetence?.id } />
        </UniversiForm2>
        //         {
        //             DTOName: "level", label: "Nível de Experiência", type: FormInputs.RADIO,
        //             value: editCompetence?.level ? makeLevelOption(editCompetence.level) : undefined,
        //             options: levelOptions, required: true
        //         },
        // />
    );

    function makeLevelOption(level: Level) {
        return {
            value: level,
            label: `${LevelToLabel[level]}: ${LevelToDescription[level]}`,
        };
    }

    async function handleCreateCompetenceType(name : string) {
        const createRes = await UniversimeApi.CompetenceType.create({ name });
        if (!createRes.success) return;

        const listRes = await UniversimeApi.CompetenceType.list();
        if (!listRes.success) return;

        const newOptions = orderByName(listRes.body.list);

        return {
            createdObject: newOptions.find(ct => stringUtils.equalsIgnoreCase(ct.name, name))!,
            newOptions,
        };
    }
}
