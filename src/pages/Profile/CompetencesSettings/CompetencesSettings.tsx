import { ChangeEvent } from "react";
import * as RadioGroup from '@radix-ui/react-radio-group';

export type CompetencesLevel = {
    apiValue: number;
    name: string;
};

export type CompetencesSettingsProps = {
    levels: CompetencesLevel[]

    // todo: Competence type according to API
    competences: {
        apiValue: string,
        name: string,
        level: Number
    }[];
};

export function CompetencesSettings(props: CompetencesSettingsProps) {
    return (
        <div id="competences-settings">
            <div className="heading">Editar minhas competências</div>
            <form action="" className="settings-form">
                <div className="section competence">
                    <h2>Competência</h2>
                    <select name="competence" id="competence" onChange={changeCompetence}>
                        <option value="" disabled selected>Selecione uma competência</option>
                        {
                            props.competences.map(competence => {
                                return (
                                    <option value={competence.apiValue} key={competence.apiValue}>{competence.name}</option>
                                );
                            })
                        }
                    </select>
                </div>
                <div className="section description">
                    <h2>Descrição</h2>
                    <textarea name="description" id="description" placeholder="Descreva a forma que alcançou essa competência"></textarea>
                </div>
                <div className="section level">
                    <h2>Selecione o nível de experiência</h2>
                    <RadioGroup.Root className="radio-root" name="level" id="level">
                        {
                            props.levels.map(level => {
                                const radioId = `level-${level.apiValue}`;
                                return (

                                    <div className="level-container" key={level.apiValue}>
                                        <RadioGroup.Item value={level.apiValue.toString()} className="radio-item" id={radioId}>
                                            <RadioGroup.Indicator className="radio-indicator" />
                                        </RadioGroup.Item>
                                        <label htmlFor={radioId}>{level.name}</label>
                                    </div>
                                );
                            })
                        }
                    </RadioGroup.Root>
                </div>
                <div className="submit">
                    <button type="button" className="cancel">Cancelar alterações</button>
                    <button type="button" className="cancel">Salvar alterações</button>
                </div>
            </form>
        </div>
    );

    function changeCompetence(e: ChangeEvent<HTMLSelectElement>) {

    }
}
