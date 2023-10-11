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
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isPresent, setIsPresent] = useState(false);
    const handlePresentDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsPresent(e.target.checked);
        if (e.target.checked) {
          setEndDate("");
        }
    };

    return (
        profileContext === null ? null :
        <div id="competences-settings">
            <div className="heading">Editar minha Formação</div>
            <div className="settings-form">
                <div className="section competence-type">
                    <h2 className="section-heading">Selecione a Instituição</h2>
                    <select name="institution-type" defaultValue={editEducation?.institution.id ?? ""}>
                        <option disabled value={""}>Selecione a Insituição de Formação</option>
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
                    <h2 className="section-heading">Tipo de Formação</h2>
                    <select name="education-type" defaultValue={editEducation?.typeEducation.id ?? ""}>
                        <option disabled value={""}>Selecione a Insituição de Formação</option>
                        {
                            profileContext.allTypeEducation.map(typeEducation => {
                                return (
                                    <option value={typeEducation.id} key={typeEducation.id}>{typeEducation.name}</option>
                                );
                            })
                        }
                    </select>
                </div>
                <div className="">
                    <h2 className="section-heading">Data Inicial</h2>
                    <input type="date" name="startDate" placeholder="Data Inicial" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                    {!isPresent && (
                      <input type="date" name="endDate" placeholder="Data Final" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                    )}
                    <label>
                        <input type="checkbox" checked={isPresent} onChange={handlePresentDateChange} name="presentDate"/>
                        Data Presente
                    </label>
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
        const typeElement = document.querySelector('[name="institution-type"]') as HTMLSelectElement;

        const presentDateElement = document.querySelector('[name="presentDate"]') as HTMLInputElement;
        const presentDate = presentDateElement.checked;

        const startDateElement = document.querySelector('[name="startDate"]') as HTMLInputElement;
        const startDate = startDateElement.value;

        const endDateElement = document.querySelector('[name="endDate"]') as HTMLInputElement | null;
        const endDate = endDateElement?.value;

        const typeEducationElement = document.querySelector('[name="education-type"]') as HTMLSelectElement;

        const educationId = profileContext?.editEducation?.id ?? null;

        const apiOperation = educationId === null
            ? UniversimeApi.Education.create({
                institutionId: typeElement.value,
                presentDate,
                startDate,
                endDate: endDate ?? "",
                typeEducationId: typeEducationElement.value,
            })

            : UniversimeApi.Education.update({
                educationId,
                institutionId: typeElement.value,
                presentDate,
                startDate,
                endDate: endDate ?? "",
                typeEducationId: typeEducationElement.value,
            });

        apiOperation.then((r) => {
            if (!r.success)
                throw new Error(r.message);

            profileContext?.reloadPage();
            
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


