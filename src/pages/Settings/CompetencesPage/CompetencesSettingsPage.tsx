import { type MouseEvent, useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom"

import UniversimeApi from "@/services/UniversimeApi";
import { Filter } from "@/components/Filter/Filter";
import { type CompetencesSettingsLoaderResponse, SettingsDescription, SettingsTitle } from "@/pages/Settings";

import * as SwalUtils from "@/utils/sweetalertUtils";
import { stringIncludesIgnoreCase } from "@/utils/stringUtils";
import { groupArray } from "@/utils/arrayUtils";
import { makeClassName, setStateAsValue } from "@/utils/tsxUtils";

import { type CompetenceType } from "@/types/Competence";
import "./CompetencesSettingsPage.less";

export function CompetencesSettingsPage() {
    const loaderData = useLoaderData() as CompetencesSettingsLoaderResponse;
    const navigate = useNavigate();

    const [reviewedFilter, setReviewedFilter] = useState("");
    const [unreviewedFilter, setUnreviewedFilter] = useState("");

    const [competenceTypes, setCompetenceTypes] = useState<CompetenceType[]>(loaderData.competenceTypes ?? []);

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
    const unreviewedCompetenceTypes = groupedArrays.get("unreviewed")!;
    const reviewedCompetenceTypes = groupedArrays.get("reviewed")!;

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
                ? unreviewedFilteredCompetences.map(ct => <CompetenceTypeEditor key={ct.id} ct={ct} refreshCTs={refreshCompetenceTypes} />)
                : <p className="empty-competences">
                { reviewedCompetenceTypes.length > 0
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
                ? reviewedFilteredCompetences.map(ct => <CompetenceTypeEditor key={ct.id} ct={ct} refreshCTs={refreshCompetenceTypes} />)
                : <p className="empty-competences">
                { unreviewedCompetenceTypes.length > 0
                    ? "Nenhuma competência encontrada."
                    : "Nenhuma competência revisada no momento."
                }
                </p>
            }
            </div>
        </section>
    </div>;

    async function refreshCompetenceTypes() {
        const competenceTypes = await UniversimeApi.CompetenceType.list();
        setCompetenceTypes(competenceTypes.body?.list ?? []);
    }
}

type CompetenceTypeEditorProps = {
    ct: CompetenceType;
    refreshCTs: () => any;
};

function CompetenceTypeEditor(props: Readonly<CompetenceTypeEditorProps>) {
    const { ct, refreshCTs } = props;

    const [nameInput, setNameInput] = useState<string>();
    const renderNameChange = nameInput !== undefined;

    /* On click edit focus on the input */
    useEffect(() => {
        if (nameInput === undefined) return;

        document
            .querySelector(`.competence-editor[data-competence-name="${ct.name}"] form.competence-editing-form`)
            ?.getElementsByTagName("input")
            .item(0)?.focus();
    }, [nameInput]);

    const reviewTitle = ct.reviewed
        ? "Essa competência já foi revisada por um administrador"
        : "Clique para aprovar essa competência";

    const reviewAction = ct.reviewed
        ? () => {}
        : reviewCompetence;

    return <div className="competence-editor" data-competence-name={ct.name}>
        { renderNameChange ||
        <button disabled={ct.reviewed} title={reviewTitle} onClick={reviewAction} className="competence-interact-button">
            <i className={makeClassName("bi", ct.reviewed ? "bi-check-circle-fill" : "bi-check-circle")} />
        </button>
        }

        <h2>
            { renderNameChange
                ? <form className="competence-editing-form competencetype-name-wrapper">
                    <button type="submit" className="competence-interact-button" onClick={saveNameChange} title="Salvar mudanças">
                        <i className="bi bi-floppy-fill"/>
                    </button>
                    <button type="reset" className="competence-interact-button competence-cancel-name" onClick={() => setNameInput(undefined)} title="Cancelar mudanças">
                        <i className="bi bi-x-circle"/>
                    </button>
                    <input type="text" className="competence-name-input competencetype-name" defaultValue={ct.name} onChange={setStateAsValue(setNameInput)} />
                </form>
                : <div className="competencetype-name-wrapper">
                    <button type="button" className="competence-interact-button" onClick={() => setNameInput(ct.name)} title="Alterar nome da competência">
                        <i className="bi bi-pencil-square"/>
                    </button>
                    <h3 className="competencetype-name"> { ct.name } </h3>
                </div>
            }
        </h2>
    </div>

    async function reviewCompetence() {
        const response = await SwalUtils.fireModal({
            title: `Deseja aprovar a competência "${ct.name}"?`,
            text: "Essa competência se tornará visível para todos os usuários do Universi.me.",

            showConfirmButton: true,
            confirmButtonText: "Aprovar competência",
            showCancelButton: true,
            cancelButtonText: "Cancelar ação"
        });

        if (!response.isConfirmed)
            return;

        await UniversimeApi.CompetenceType.update({ id: ct.id, reviewed: true });
        await refreshCTs();
    }

    async function saveNameChange(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        if (nameInput === undefined)
            return;

        await UniversimeApi.CompetenceType.update({ id: ct.id, name: nameInput });
        await refreshCTs();
        setNameInput(undefined);
    }
}
