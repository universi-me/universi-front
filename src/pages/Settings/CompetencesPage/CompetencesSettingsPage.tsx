import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

import { UniversimeApi } from "@/services"
import { Filter } from "@/components/Filter/Filter";
import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";
import { type CompetencesSettingsLoaderResponse, SettingsDescription, SettingsTitle, CompetenceTypeEditor } from "@/pages/Settings";

import * as SwalUtils from "@/utils/sweetalertUtils";
import { stringIncludesIgnoreCase } from "@/utils/stringUtils";
import { groupArray } from "@/utils/arrayUtils";

import { type CompetenceType } from "@/types/Competence";
import "./CompetencesSettingsPage.less";

export function CompetencesSettingsPage() {
    const loaderData = useLoaderData() as CompetencesSettingsLoaderResponse;
    const navigate = useNavigate();

    const [reviewedFilter, setReviewedFilter] = useState("");
    const [unreviewedFilter, setUnreviewedFilter] = useState("");

    const [competenceTypes, setCompetenceTypes] = useState<CompetenceType[]>(loaderData.competenceTypes ?? []);

    const [mergeCompetence, setMergeCompetence] = useState<CompetenceType | undefined>();
    const renderSelectMerge = mergeCompetence !== undefined;

    if (loaderData.competenceTypes === undefined) {
        SwalUtils.fireModal({
            title: "Erro ao carregar dados de competências",
            text: loaderData.errorReason,

            showConfirmButton: true,
            confirmButtonText: "Voltar para configurações",
        }).then(response => {
            navigate("/settings")
        });

        return null;
    }

    const sortedCompetenceTypes = [...competenceTypes]
        .sort((ct1, ct2) => ct1.name.localeCompare(ct2.name));

    const groupedArrays = groupArray(sortedCompetenceTypes, ct => ct.reviewed ? "reviewed" : "unreviewed");
    const unreviewedCompetenceTypes = groupedArrays.get("unreviewed") ?? [];
    const reviewedCompetenceTypes = groupedArrays.get("reviewed") ?? [];

    const unreviewedFilteredCompetences = unreviewedCompetenceTypes
        .filter(ct => stringIncludesIgnoreCase(ct.name, unreviewedFilter));
    const reviewedFilteredCompetences = reviewedCompetenceTypes
        .filter(ct => stringIncludesIgnoreCase(ct.name, reviewedFilter));

    return <div id="competences-admin-settings">
        <SettingsTitle>Competências</SettingsTitle>
        <SettingsDescription>Aqui você pode configurar as competências disponíveis na plataforma.</SettingsDescription>

        <section id="unreviewed-competences" className="competence-section">
            <div className="competence-section-title-filter-wrapper">
                <h2 className="competence-section-title">Competências para revisar</h2>
                <Filter placeholderMessage="Pesquisar competências..." setter={setUnreviewedFilter} />
            </div>

            <p className="competence-section-description">
                Lista de competências criadas pelos usuários da plataforma e com visibilidade limitada.
                Ficarão visíveis para todos os usuários assim que forem revisadas por um administrador.
            </p>

            <div className="competences-wrapper">
            { unreviewedFilteredCompetences.length > 0
                ? unreviewedFilteredCompetences.map(ct => <CompetenceTypeEditor key={ct.id} ct={ct} refreshCompetenceTypes={refreshCompetenceTypes} setMergedCompetence={setMergeCompetence} />)
                : <p className="empty-competences">
                { unreviewedCompetenceTypes.length > 0
                    ? "Nenhuma competência encontrada."
                    : "Nenhuma competência precisa ser revisada no momento."
                }
                </p>
            }
            </div>
        </section>

        <section id="reviewed-competences" className="competence-section">
            <div className="competence-section-title-filter-wrapper">
                <h2 className="competence-section-title">Competências já revisadas</h2>
                <Filter placeholderMessage="Pesquisar competências..." setter={setReviewedFilter} />
            </div>
            <p className="competence-section-description">
                Lista de competências já revisadas por administradores da plataforma.
                Estão visíveis para todos os usuários.
            </p>

            <div className="competences-wrapper">
            { reviewedFilteredCompetences.length > 0
                ? reviewedFilteredCompetences.map(ct => <CompetenceTypeEditor key={ct.id} ct={ct} refreshCompetenceTypes={refreshCompetenceTypes} />)
                : <p className="empty-competences">
                { reviewedCompetenceTypes.length > 0
                    ? "Nenhuma competência encontrada."
                    : "Nenhuma competência revisada no momento."
                }
                </p>
            }
            </div>
        </section>

        { renderSelectMerge && 
            <UniversiForm formTitle="Fundir competência" objects={[
                {
                    DTOName: "remainingCompetenceTypeId", label: `Substituir "${mergeCompetence.name}" por:`, type: FormInputs.SELECT_SINGLE,
                    canCreate: false, options: reviewedCompetenceTypes.map(ct => ({ label: ct.name, value: ct.id })), required: true,
                }
            ]} requisition={mergeCompetences} callback={async() => {setMergeCompetence(undefined); await refreshCompetenceTypes()}}/>
        }
    </div>;

    async function refreshCompetenceTypes() {
        const competenceTypes = await UniversimeApi.CompetenceType.list();
        setCompetenceTypes(competenceTypes.body?.list ?? []);
    }

    type MergeCompetencesProps = {
        remainingCompetenceTypeId: string;
    }
    async function mergeCompetences(props: MergeCompetencesProps) {
        if (mergeCompetence === undefined)
            return;

        const { remainingCompetenceTypeId } = props;

        await UniversimeApi.Admin.mergeCompetenceType({
            remainingCompetenceTypeId,
            removedCompetenceTypeId: mergeCompetence.id
        });
    }
}
