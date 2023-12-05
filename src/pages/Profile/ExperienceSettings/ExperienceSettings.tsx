import { useContext, useState } from "react";

import { ProfileContext } from "@/pages/Profile";
import { UniversimeApi } from "@/services/UniversimeApi";
import * as SwalUtils from "@/utils/sweetalertUtils";

import './ExperienceSetting.less'

export type ExperienceSettingsProps = {
    cancelChanges: () => any;
};

export function ExperienceSettings(props: ExperienceSettingsProps) {
    const profileContext = useContext(ProfileContext)
    const editExperience = profileContext?.editExperience ?? null;
    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [isPresent, setIsPresent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handlePresentDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsPresent(e.target.checked);
        if (e.target.checked) {
          setDateEnd("");
        }
        setError(null)
    };

    return (
        profileContext === null ? null :
        <div id="competences-settings">
            <div className="heading">Adicionar Experiência</div>
            <div className="settings-form">
                <div className="section competence-type">
                    <div className="flex-direction">
                        <h2 className="section-heading">Tipo de Experiência</h2>
                        <h2 className="section-heading observation">*</h2>
                    </div>
                    <select name="experience-type" defaultValue={editExperience?.typeExperience.id ?? ""}>
                        <option disabled value={""}>Selecione o Tipo de Experiência</option>
                        {
                            profileContext.allTypeExperience.map(experienceType => {
                                return (
                                    <option value={experienceType.id} key={experienceType.id}>{experienceType.name}</option>
                                );
                            })
                        }
                        
                    </select>
                </div>
                <div className="section">
                    <div className="flex-direction">
                        <h2 className="section-heading">Descrição</h2>
                        <h2 className="section-heading observation">*</h2>
                    </div>
                    <textarea name="description" defaultValue={editExperience?.description} maxLength={150} />
                </div>
                <div className="section">
                    <div className="flex-direction">
                        <h2 className="section-heading">Local</h2>
                        <h2 className="section-heading observation">*</h2>
                    </div>
                    <textarea name="local" defaultValue={editExperience?.local} maxLength={30} />
                </div>
                <div className="section flex-direction dim-date">
                    <div className="section">
                        <h2 className="section-heading">Data de Inicio</h2>
                        <input name="startDate" className="date-input" type="date" placeholder="Data Inicial" value={dateStart} onChange={(e) => {setDateStart(e.target.value); setError(null);}} />
                    </div>
                    {!isPresent && (
                    <div className="section ajust-date">
                        <h2 className="section-heading">Data de Termino</h2>
                        <input name="endDate" className="date-input" type="date" placeholder="Data Final" value={dateEnd} onChange={(e) => {setDateEnd(e.target.value); setError(null);}} />
                    </div>
                    )}
                </div>
                <div className="section">
                    {error && <p className="error-date">{error}</p>}
                </div>
                <div className="section">
                    <input className="presentDate" name="presentDate" type="checkbox" checked={isPresent} onChange={handlePresentDateChange}/>
                    Exercendo Atualmente
                </div>
                

                <div className="buttons">
                    {
                        profileContext.editEducation?.id === undefined ? null :
                        <button type="button" className="remove-button" onClick={removeEducation} title="Remover competência">
                            <i className="bi bi-trash-fill" />
                        </button>
                    }

                    <div className="submit">
                        <button type="button" className="cancel-button" onClick={props.cancelChanges}>Cancelar alterações</button>
                        <button type="button" className="submit-button" onClick={saveEducation}>Salvar alterações</button>
                    </div>
                </div>
            </div>
        </div>
    );

    function saveEducation() {

        if (!isPresent) {
            const startDate = new Date(dateStart);
            const endDate = new Date(dateEnd);

            if (endDate < startDate) {
                setError('Erro: A data de término não pode ser menor que a data de início.');
                return;
            }
        }

        const typeExperienceElement = document.querySelector('[name="experience-type"]') as HTMLSelectElement;

        const descriptionDateElement = document.querySelector('[name="description"]') as HTMLTextAreaElement;
        const description = descriptionDateElement.value;

        const localDateElement = document.querySelector('[name="local"]') as HTMLTextAreaElement;
        const local = localDateElement.value;

        const startDateElement = document.querySelector('[name="startDate"]') as HTMLInputElement;
        const startDate = startDateElement.value;

        const endDateElement = document.querySelector('[name="endDate"]') as HTMLInputElement | null;
        const endDate = endDateElement?.value || "0000-00-00";

        const presentDateElement = document.querySelector('[name="presentDate"]') as HTMLInputElement;
        const presentDate = presentDateElement.checked;

        const profileExperienceId = profileContext?.editExperience?.id ?? null;

        const apiOperation = profileExperienceId === null
            ? UniversimeApi.Experience.create({
                typeExperienceId: typeExperienceElement.value ,
                description,
                local,
                presentDate,
                startDate,
                endDate,
            })

            : UniversimeApi.Experience.update({
                profileExperienceId,
                typeExperienceId: typeExperienceElement.value ,
                description,
                local,
                presentDate,
                startDate,
                endDate,
            });

        apiOperation.then((r) => {
            if (!r.success)
                throw new Error(r.message);

            window.location.reload();
        }).catch((reason: Error) => {
            SwalUtils.fireModal({
                title: "Erro ao salvar a Formação",
                text: reason.message,
                icon: "error",
            });
        })
    }

    function removeEducation() {
        if (!profileContext || !profileContext.editEducation)
            return;

        UniversimeApi.Competence.remove({competenceId: profileContext.editEducation.id})
            .then((r) => {
                if (!r.success)
                    throw new Error(r.message);

                profileContext?.reloadPage();
            }).catch((reason: Error) => {
                SwalUtils.fireModal({
                    title: "Erro ao remover a Formação",
                    text: reason.message,
                    icon: "error",
                })
            });
    }
}


