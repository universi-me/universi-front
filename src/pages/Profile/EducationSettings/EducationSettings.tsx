import { useContext, useState } from "react";

import { ProfileContext } from "@/pages/Profile";
import { UniversimeApi } from "@/services/UniversimeApi";
import * as SwalUtils from "@/utils/sweetalertUtils";

import './EducationSetting.less'

export type EducationSettingsProps = {
    cancelChanges: () => any;
};

export function EducationSettings(props: EducationSettingsProps) {
    const profileContext = useContext(ProfileContext)
    const editEducation = profileContext?.editEducation ?? null;
    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [isPresent, setIsPresent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handlePresentDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsPresent(e.target.checked);
        if (e.target.checked) {
          setDateEnd("");
        }
    };

    return (
        profileContext === null ? null :
        <div id="competences-settings">
            <div className="heading">Adicionar Formação</div>
            <div className="settings-form">
                <div className="section competence-type">
                    <div className="flex-direction">
                        <h2 className="section-heading">Instituição Acadêmica</h2>
                        <h2 className="section-heading observation">*</h2>
                    </div>
                    <select name="institution-type" defaultValue={editEducation?.institution.id ?? ""}>
                        <option disabled value={""}>Selecione a Insituição</option>
                        {
                            profileContext.allInstitution.map(institutionType => {
                                return (
                                    <option value={institutionType.id} key={institutionType.id}>{institutionType.name}</option>
                                );
                            })
                        }
                    </select>
                </div>

                <div className="section level">
                    <div className="flex-direction">
                        <h2 className="section-heading">Tipo de Formação</h2>
                        <h2 className="section-heading observation">*</h2>
                    </div>
                    <select name="education-type" defaultValue={editEducation?.typeEducation.id ?? ""}>
                        <option disabled value={""}>Selecione o tipo de Formação</option>
                        {
                            profileContext.allTypeEducation.map(typeEducation => {
                                return (
                                    <option value={typeEducation.id} key={typeEducation.id}>{typeEducation.name}</option>
                                );
                            })
                        }
                    </select>
                </div>
                <div className="section flex-direction dim-date">
                    <div className="section">
                        <h2 className="section-heading">Data de Inicio</h2>
                        <input name="startDate" className="date-input" type="date" placeholder="Data Inicial" value={dateStart} onChange={(e) => setDateStart(e.target.value)}/>
                    </div>
                    {!isPresent && (
                    <div className="section ajust-date">
                        <h2 className="section-heading">Data de Termino</h2>
                        <input name="endDate" className="date-input" type="date" placeholder="Data Final" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
                    </div>
                    )}
                </div>
                <div className="section">
                    {error && <p className="error-date">{error}</p>}
                </div>
                <div className="section">
                    <input className="presentDate" name="presentDate" type="checkbox" checked={isPresent} onChange={handlePresentDateChange}/>
                    Ainda não finalizei
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
                setError('( Erro: A data de término não pode ser menor que a data de início. )');
                return;
            }
        }
        
        const typeElement = document.querySelector('[name="institution-type"]') as HTMLSelectElement;

        const presentDateElement = document.querySelector('[name="presentDate"]') as HTMLInputElement;
        const presentDate = presentDateElement.checked;

        const startDateElement = document.querySelector('[name="startDate"]') as HTMLInputElement;
        const startDate = startDateElement.value;

        const endDateElement = document.querySelector('[name="endDate"]') as HTMLInputElement | null;
        const endDate = endDateElement?.value || "0000-00-00";

        const typeEducationElement = document.querySelector('[name="education-type"]') as HTMLSelectElement;

        const educationId = profileContext?.editEducation?.id ?? null;

        const apiOperation = educationId === null
            ? UniversimeApi.Education.create({
                institutionId: typeElement.value,
                presentDate,
                startDate,
                endDate,
                typeEducationId: typeEducationElement.value,
            })

            : UniversimeApi.Education.update({
                educationId,
                institutionId: typeElement.value,
                presentDate,
                startDate,
                endDate,
                typeEducationId: typeEducationElement.value,
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


