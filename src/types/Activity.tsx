import { UniversimeApi } from "@/services";
import { UniversiFormSelectInput, UniversiFormSelectInputProps } from "@/components/UniversiForm/inputs/UniversiFormSelectInput";

export function compareActivityTypes( at1: Activity.Type, at2: Activity.Type ) {
    return at1.name.localeCompare( at2.name );
}

export function compareActivities( a1: Activity.DTO, a2: Activity.DTO ): number {
    return a1.group.name.localeCompare( a2.group.name );
}

export function ActivityTypeSelect<C extends Optional<boolean>>( props: Readonly<ActivityTypeSelectProps<C>> ) {
    return <UniversiFormSelectInput
        { ...props }
        getOptionLabel={ at => at.name }
        getOptionUniqueValue={ at => at.id }
        sortOptions={ compareActivityTypes }
        canCreateOptions
        onCreateOption={ async name => {
            const res = await UniversimeApi.ActivityType.create( { name } );
            return res.body;
        } }
    />
}

export type ActivityTypeSelectProps<Clearable extends Optional<boolean>> = Omit<
    UniversiFormSelectInputProps<ActivityType, false, Clearable>,
    "getOptionUniqueValue" | "canCreateOptions" | "getOptionLabel" | "onCreateOption" | "sortOptions"
>;
