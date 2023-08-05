import { ChangeEvent, MouseEventHandler, useContext, useState } from "react";
import * as RadioGroup from '@radix-ui/react-radio-group';
import { ProfileContext } from "@/pages/Profile";
import { Competence, LevelToLabel } from "@/types/Competence";
import './CompetencesSettings.css'

export type CompetencesSettingsProps = {
    cancelAction?: MouseEventHandler;
    submitAction?: MouseEventHandler;
};

export function CompetencesSettings(props: CompetencesSettingsProps) {
    const profileContext = useContext(ProfileContext)
    const [currentCompetence, setCurrentCompetence] = useState<Competence | undefined>(undefined);
    if (profileContext === null)
        return null;

    console.log(currentCompetence?.level);

    return (
        <div id="competences-settings">
            <div className="heading">Editar minhas competências</div>
            <form action="" className="settings-form">
                <div className="section competence">
                    <h2>Competência</h2>
                    <select name="competence" id="competence" onChange={changeCompetence}
                        defaultValue={currentCompetence?.competenceType.id ?? -1}
                        style={{color: currentCompetence === undefined ? '#6F6F6F' : 'black'}}
                    >
                        <option value="-1" disabled>Selecione uma competência</option>
                        {
                            profileContext.allCompetences.map(competence => {
                                return (
                                    <option value={competence.id} key={competence.id}>{competence.competenceType.name}</option>
                                );
                            })
                        }
                    </select>
                </div>
                <div className="section description">
                    <h2>Descrição</h2>
                    <textarea name="description" id="description" placeholder="Descreva a forma que alcançou essa competência"
                        defaultValue={currentCompetence?.description ?? ''}></textarea>
                </div>
                <div className="section level">
                    <h2>Selecione o nível de experiência</h2>
                    <RadioGroup.Root className="radio-root" name="level" id="level" defaultValue={currentCompetence?.level}>
                        {
                            Object.entries(LevelToLabel).map(([level, label]) => {
                                return (
                                    <div className="level-container" key={level}>
                                        <RadioGroup.Item value={level} className="radio-item" id={level} >
                                            <RadioGroup.Indicator className="radio-indicator" />
                                        </RadioGroup.Item>
                                        <label htmlFor={level}>{label}</label>
                                    </div>
                                );
                            })
                        }
                    </RadioGroup.Root>
                </div>
                <div className="submit">
                    <button type="button" className="cancel-button" onClick={props.cancelAction}>Cancelar alterações</button>
                    <button type="button" className="submit-button" onClick={props.submitAction}>Salvar alterações</button>
                </div>
            </form>
        </div>
    );

    function changeCompetence(e: ChangeEvent<HTMLSelectElement>) {
        setCurrentCompetence(profileContext?.profileListData.competences.find(c => c.id.toString() === e.target.value));
        document.querySelectorAll("#level .level-container").forEach(container => {
            container.getElementsByTagName("button")
        })
    }
}
