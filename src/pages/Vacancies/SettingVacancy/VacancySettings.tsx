import { ProfileContext } from "@/pages/Profile";
import { UniversimeApi } from "@/services/UniversimeApi";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { useContext, useState } from "react";


export type VacancySettingsProps = {
    cancelChanges: () => any;
};

export function VacancySettings(props: VacancySettingsProps) {
    const profileContext = useContext(ProfileContext)
    const editVacancy = profileContext?.editVacancy ?? null;
    const [registrationDate, setRegistrationDate] = useState("");
    const [endRegistrationDate, setEndRegistrationDate] = useState("");
    return (
        profileContext === null ? null :
        <div id="competences-settings">
            <div className="heading">Editar minha Formação</div>
            <div className="settings-form">
                <div className="section competence-type">
                    <h2 className="section-heading">Selecione a Instituição</h2>
                    <select name="vacancy-type" defaultValue={editVacancy?.typeVacancy.id ?? ""}>
                        <option disabled value={""}>Selecione o tipo da vaga</option>
                        {
                            profileContext.allTypeVacancy.map(vacancyType => {
                                return (
                                    <option value={vacancyType.id} key={vacancyType.id}>{vacancyType.name}</option>
                                );
                            })
                        }
                    </select>
                </div>
                <div className="section description">
                    <h2 className="section-heading">Titulo</h2>
                    <textarea name="title" defaultValue={editVacancy?.title} maxLength={40} />
                </div>
                <div className="section description">
                    <h2 className="section-heading">Descrição</h2>
                    <textarea name="description" defaultValue={editVacancy?.description} maxLength={255} />
                </div>
                <div className="section flex-direction">
                    <div className="section">
                        <h2 className="section-heading">Data de Inicio</h2>
                        <input name="startDate" className="date-input" type="date" placeholder="Data Inicial" value={registrationDate} onChange={(e) => setRegistrationDate(e.target.value)}/>
                    </div>
                    <div className="section ajust-date">
                        <h2 className="section-heading">Data de Termino</h2>
                        <input name="endDate" className="date-input" type="date" placeholder="Data Final" value={endRegistrationDate} onChange={(e) => setEndRegistrationDate(e.target.value)} />
                    </div>
                </div>

                <div className="buttons">
                    <div className="submit">
                        <button type="button" className="cancel-button" onClick={props.cancelChanges}>Cancelar alterações</button>
                        <button type="button" className="submit-button" onClick={saveVacancy}>Salvar alterações</button>
                    </div>
                </div>
            </div>
        </div>
    );

    function saveVacancy() {
        const typeElement = document.querySelector('[name="vacancy-type"]') as HTMLSelectElement;

        const DescriptionDateElement = document.querySelector('[name="description"]') as HTMLTextAreaElement;
        const description = DescriptionDateElement.value;

        const TitleDateElement = document.querySelector('[name="title"]') as HTMLTextAreaElement;
        const title = TitleDateElement.value;

        const registrationDateElement = document.querySelector('[name="registrationDate"]') as HTMLInputElement;
        const registrationDate = registrationDateElement.value;

        const prerequisitesDateElement = document.querySelector('[name="prerequisites"]') as HTMLInputElement;
        const prerequisites = prerequisitesDateElement.value;

        const endRegistrationDateElement = document.querySelector('[name="endRegistrationDate"]') as HTMLInputElement;
        const endRegistrationDate = endRegistrationDateElement.value;

        const vacancyId = profileContext?.editVacancy?.id ?? null;

        const apiOperation = vacancyId === null
            ? UniversimeApi.Vacancy.create({
                typeVacancyId: typeElement.value,
                title,
                description,
                prerequisites,
                registrationDate,
                endRegistrationDate,
            })

            : UniversimeApi.Vacancy.update({
                vacancyId,
                typeVacancyId: typeElement.value,
                title,
                description,
                prerequisites,
                registrationDate,
                endRegistrationDate,
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
}