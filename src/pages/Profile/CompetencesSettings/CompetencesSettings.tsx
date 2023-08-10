import { MouseEventHandler, useContext, useMemo, useState } from "react";
import { ProfileContext } from "@/pages/Profile";
import { LevelToLabel } from "@/types/Competence";
import './CompetencesSettings.less'

export type CompetencesSettingsProps = {
    cancelAction?: MouseEventHandler;
    submitAction?: MouseEventHandler;
};

export function CompetencesSettings(props: CompetencesSettingsProps) {
    const profileContext = useContext(ProfileContext)
    const editCompetence = profileContext?.editCompetence ?? null;

    return (
        profileContext === null ? null :
        <div id="competences-settings">
            <div className="heading">Editar minhas competências</div>
            <div className="settings-form">
                <div className="section competence-type">
                    <h2 className="section-heading">Tipo de Competência</h2>
                    <select name="competence-type" defaultValue={editCompetence?.competenceType.id ?? -1}>
                        <option disabled value={-1}>Selecione o tipo da competência</option>
                        {
                            profileContext.allCompetenceTypes.map(competenceType => {
                                return (
                                    <option value={competenceType.id} key={competenceType.id}>{competenceType.name}</option>
                                );
                            })
                        }
                    </select>
                </div>

                <div className="section description">
                    <h2 className="section-heading">Descrição</h2>
                    <textarea name="description" defaultValue={editCompetence?.description} maxLength={255} />
                </div>

                <div className="section level">
                    <h2 className="section-heading">Nível de Experiência</h2>
                    <select name="level" defaultValue={editCompetence?.level ?? ""}>
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

                <div className="submit">
                    <button type="button" className="cancel-button" onClick={props.cancelAction}>Cancelar alterações</button>
                    <button type="button" className="submit-button" onClick={props.submitAction}>Salvar alterações</button>
                </div>
            </div>
        </div>
    );
}
