import { useContext } from "react";
import { ProfileContext } from "@/pages/Profile";
import { LevelToLabel } from "@/types/Competence";
import './CompetencesSettings.less'
import { UniversimeApi } from "@/services/UniversimeApi";

export type CompetencesSettingsProps = {
    cancelChanges: () => any;
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

                <div className="buttons">
                    {
                        profileContext.editCompetence?.id === undefined ? null :
                        <button type="button" className="remove-button" onClick={removeCompetence} title="Remover competência">
                            <i className="bi bi-trash-fill" />
                        </button>
                    }

                    <div className="submit">
                        <button type="button" className="cancel-button" onClick={props.cancelChanges}>Cancelar alterações</button>
                        <button type="button" className="submit-button" onClick={saveCompetence}>Salvar alterações</button>
                    </div>
                </div>
            </div>
        </div>
    );

    function saveCompetence() {
        const typeElement = document.querySelector('[name="competence-type"]') as HTMLSelectElement;
        const competenceTypeId = parseInt(typeElement.value);

        const descriptionElement = document.querySelector('[name="description"]') as HTMLTextAreaElement;
        const description = descriptionElement.value;

        const levelElement = document.querySelector('[name="level"]') as HTMLSelectElement;
        const level = levelElement.value;

        const competenceId = profileContext?.editCompetence?.id ?? null;

        const apiOperation = competenceId === null
            ? UniversimeApi.Competence.create({
                competenceTypeId,
                description,
                level,
            })

            : UniversimeApi.Competence.update({
                competenceId,
                competenceTypeId,
                description,
                level,
            });

        apiOperation.then((r) => {
            profileContext?.reloadPage();
        })
    }

    function removeCompetence() {
        UniversimeApi.Competence.remove({competenceId: profileContext?.editCompetence?.id ?? -1})
            .then((r) => profileContext?.reloadPage());
    }
}
