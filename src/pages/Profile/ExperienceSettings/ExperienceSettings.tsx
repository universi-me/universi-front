import { useContext, useState } from "react";

import { ProfileContext } from "@/pages/Profile";
import { UniversimeApi } from "@/services"

import UniversiForm from "@/components/UniversiForm";
import { InstitutionSelect } from "@/types/Institution";
import { ExperienceTypeSelect } from "@/types/Experience";

export function ExperienceSettings() {
    const profileContext = useContext(ProfileContext)

    const experience = profileContext?.editExperience;
    const isCreating = !experience;
    const [ presentDate, setPresentDate ] = useState( isCreating ? false : !profileContext?.editEducation?.endDate );

    return (
        profileContext &&
        <UniversiForm.Root title={ experience?.id ? "Editar Experiência" : "Adicionar Experiência" } callback={ handleForm }>
            <ExperienceTypeSelect
                param="experienceType"
                label="Tipo de Experiência"
                defaultValue={ experience?.experienceType }
                options={ profileContext.allTypeExperience }
                required
            />

            <UniversiForm.Input.Text
                param="description"
                label="Descrição"
                isLongText
                maxLength={ 200 }
                defaultValue={ experience?.description }
                required
            />

            <InstitutionSelect
                param="institution"
                label="Instituição"
                defaultValue={ experience?.institution }
                options={ profileContext.allInstitution }
                required
            />

            <UniversiForm.Input.Date
                param="startDate"
                label="Data de Início"
                defaultValue={ experience?.startDate }
                required
            />

            <UniversiForm.Input.Switch
                param="presentDate"
                label="Ainda em andamento?"
                defaultValue={ presentDate }
                onChange={ setPresentDate }
            />

            { !presentDate && <UniversiForm.Input.Date
                param="endDate"
                label="Data de Término"
                defaultValue={ experience?.endDate ?? undefined }
                required
                validations={ [
                    ( endDate, form ) => {
                        const startDate = form.startDate as Optional<Date>;
                        return !!endDate && !!startDate && ( endDate >= startDate )
                    },
                ] }
            /> }

        </UniversiForm.Root>
        // <UniversiForm
        //     requisition={ profileContext?.editExperience?.id ? UniversimeApi.Experience.update : UniversimeApi.Experience.create }
        //     callback={async ()=>await profileContext?.reloadPage() }
        // />
    );

    async function handleForm( form: ExperienceSettingsForm ) {
        if ( !form.confirmed ) {
            await profileContext?.setEditExperience( undefined );
            return;
        }

        const body = {
            experienceType: form.body.experienceType.id,
            institution: form.body.institution.id,
            description: form.body.description,
            startDate: form.body.startDate.getTime(),
            endDate: form.body.presentDate
                ? null
                : form.body.endDate?.getTime() ?? null,
        };

        const res = experience
            ? await UniversimeApi.Experience.update( { ...body, experienceId: experience.id, } )
            : await UniversimeApi.Experience.create( body );

        await profileContext?.reloadPage();
    }
}

type ExperienceSettingsForm = UniversiForm.Data<{
    experienceType: Experience.Type;
    description: string;
    institution: Institution;
    startDate: Date;
    presentDate: boolean;
    endDate: Optional<Date>;
}>;
