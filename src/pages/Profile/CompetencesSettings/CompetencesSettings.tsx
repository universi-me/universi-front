import { useContext, useState } from "react";

import { ProfileContext } from "@/pages/Profile";
import { Level, LevelToLabel } from "@/types/Competence";
import { UniversimeApi } from "@/services/UniversimeApi";
import { deactivateButtonWhile, setStateAsValue } from "@/utils/tsxUtils";
import * as SwalUtils from "@/utils/sweetalertUtils";

import './CompetencesSettings.less'

export function CompetencesSettings() {
    const profileContext = useContext(ProfileContext)
    const editCompetence = profileContext?.editCompetence ?? null;

    const [competenceTypeId, setCompetenceTypeId] = useState<string>(editCompetence?.competenceType.id ?? "");
    const [competenceLevel, setCompetenceLevel] = useState<Level | "">(editCompetence?.level ?? "");
    const [description, setDescription] = useState<string>(editCompetence?.description ?? "");

    return (
        profileContext === null ? null :
        <div id="competences-settings">
            <div className="heading">Adicionar competência</div>
            <div className="settings-form">
                <div className="section competence-type">
                    <h2 className="section-heading">Tipo de Competência</h2>
                    <select name="competence-type" defaultValue={editCompetence?.competenceType.id ?? ""} onChange={setStateAsValue(setCompetenceTypeId)}>
                        <option disabled value={""}>Selecione o tipo da competência</option>
                        {
                            profileContext.allTypeCompetence.map(competenceType => {
                                return (
                                    <option value={competenceType.id} key={competenceType.id}>{competenceType.name}</option>
                                );
                            })
                        }
                    </select>
                </div>

                <div className="section level">
                    <h2 className="section-heading">Nível de Experiência</h2>
                    <select name="level" defaultValue={editCompetence?.level ?? ""} onChange={(e) => setCompetenceLevel(e.currentTarget.value as Level | "")}>
                        <option disabled value={""}>Selecione o nível de experiência</option>
                        {
                            Object.entries(LevelToLabel).map(([level, label]) => {
                                return (
                                    <option value={level} key={level}>{label}</option>
                                );
                            })
                        }
                    </select>
                </div>

                <div className="buttons">
                    {
                        profileContext.editCompetence?.id === undefined ? null :
                        <button type="button" className="remove-button" onClick={removeCompetence} title="Remover competência">
                            <i className="bi bi-trash-fill" />
                        </button>
                    }

                    <div className="submit">
                        <button type="button" className="cancel-button" onClick={discardCompetence}>Cancelar alterações</button>
                        <button type="button" className="submit-button" onClick={deactivateButtonWhile(saveCompetence)}>Salvar alterações</button>
                    </div>
                </div>
            </div>
        </div>
    );

    function saveCompetence() {
        const competenceId = profileContext?.editCompetence?.id ?? null;

        const apiOperation = competenceId === null
            ? UniversimeApi.Competence.create({
                competenceTypeId,
                description,
                level: competenceLevel,
            })

            : UniversimeApi.Competence.update({
                competenceId,
                competenceTypeId,
                description,
                level: competenceLevel,
            });

        apiOperation.then((r) => {
            if (!r.success)
                throw new Error(r.message);

            profileContext?.reloadPage();
        }).catch((reason: Error) => {
            SwalUtils.fireModal({
                title: "Erro ao salvar competência",
                text: reason.message,
                icon: "error",
            });
        })
    }

    function removeCompetence() {
        if (!profileContext?.editCompetence)
            return;

        UniversimeApi.Competence.remove({competenceId: profileContext.editCompetence.id})
            .then((r) => {
                if (!r.success)
                    throw new Error(r.message);

                profileContext?.reloadPage();
            }).catch((reason: Error) => {
                SwalUtils.fireModal({
                    title: "Erro ao remover competência",
                    text: reason.message,
                    icon: "error",
                })
            });
    }

    function discardCompetence() {
        if (!profileContext)
            return;

        SwalUtils.fireModal({
            showCancelButton: true,
            showConfirmButton: true,

            title : editCompetence == null ? "Descartar competência?" : "Descartar alterações?",
            text: "Tem certeza? Esta ação é irreversível", 
            confirmButtonText: "Sim",
            cancelButtonText: "Não"
        }).then((value) => {
            if (value.isConfirmed) {
                profileContext.setEditCompetence(undefined);
            }
        });
    }
}
