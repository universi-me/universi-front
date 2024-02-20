import { useState } from "react";
import { useLoaderData } from "react-router-dom"

import UniversimeApi from "@/services/UniversimeApi";
import { CompetencesSettingsLoaderResponse } from "@/pages/Settings";

import { type CompetenceType } from "@/types/Competence";

export function CompetencesSettingsPage() {
    const loaderData = useLoaderData() as CompetencesSettingsLoaderResponse;

    const [competenceTypes, setCompetenceTypes] = useState<CompetenceType[]>(loaderData.competenceTypes ?? []);

    return <div> {
        competenceTypes
            .map( c => <div key={c.id} style={{display: "block", marginBottom: "1em"}} >
                {JSON.stringify(c)}
                <button type="button" onClick={() => {
                    UniversimeApi.CompetenceType.update({ id: c.id, reviewed: true })
                        .then(refreshCompetenceTypes)
                }}> Aprovar </button>
            </div>)
    } </div>;

    async function refreshCompetenceTypes() {
        const competenceTypes = await UniversimeApi.CompetenceType.list();
        setCompetenceTypes(competenceTypes.body?.list ?? []);
    }
}
