import { useContext, useState } from "react";

import { ProfileContext } from "@/pages/Profile";
import { UniversimeApi } from "@/services";

import UniversiForm from "@/components/UniversiForm";
import { InstitutionSelect } from "@/types/Institution";

export function EducationSettings() {
    const profileContext = useContext(ProfileContext)
    const isCreating = profileContext?.editEducation === null;

    const [ presentDate, setPresentDate ] = useState( isCreating ? false : profileContext?.editEducation?.endDate === null );

    return (
        profileContext &&
        <UniversiForm.Root title={ profileContext?.editEducation?.id ? "Editar Formação" : "Adicionar Formação" } callback={ handleForm }>
            <InstitutionSelect
                param="institution"
                label="Instituição"
                defaultValue={ profileContext?.editEducation?.institution }
                options={ profileContext.allInstitution }
                required
            />

            <UniversiForm.Input.Select
                param="educationType"
                label="Tipo de Formação"
                defaultValue={ profileContext?.editEducation?.educationType }
                options={ profileContext.allTypeEducation }
                getOptionUniqueValue={ et => et.id }
                getOptionLabel={ et => et.name }
                required
                canCreateOptions
                onCreateOption={ async name => {
                    const res = await UniversimeApi.EducationType.create({ name });
                    if ( !res.isSuccess() ) return [];

                    const list = await UniversimeApi.EducationType.list();
                    return list.body ?? [];
                } }
            />

            <UniversiForm.Input.Date
                param="startDate"
                label="Data de Início"
                defaultValue={ profileContext.editEducation?.startDate }
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
                defaultValue={ profileContext.editEducation?.endDate ?? undefined }
                required
                validations={ [
                    ( endDate, form ) => {
                        const startDate = form.startDate as Optional<Date>;
                        return !!endDate && !!startDate && ( endDate >= startDate )
                    },
                ] }
            /> }
        </UniversiForm.Root>
    );

    async function handleForm( form: EducationSettingsForm ) {
        if ( !form.confirmed ) {
            profileContext?.setEditEducation( undefined );
            return;
        }

        const education = profileContext?.editEducation;

        const body = {
            educationType: form.body.educationType.id,
            institution: form.body.institution.id,
            startDate: form.body.startDate.getTime(),
            endDate: form.body.presentDate
                ? null
                : form.body.endDate?.getTime() ?? null,
        };

        const res = education
            ? await UniversimeApi.Education.update( education.id, body )
            : await UniversimeApi.Education.create( body );

        const context = await profileContext?.reloadPage();
        context?.setEditEducation( undefined );
    }
}

type EducationSettingsForm = UniversiForm.Data<{
    institution: Institution.DTO;
    educationType: Education.Type;
    startDate: Date;
    presentDate: boolean;
    endDate: Optional<Date>;
}>;
