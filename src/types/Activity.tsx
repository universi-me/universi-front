import useCache from "@/contexts/Cache";
import { UniversimeApi } from "@/services";
import { UniversiFormSelectInput, UniversiFormSelectInputProps } from "@/components/UniversiForm/inputs/UniversiFormSelectInput";
import { stringIncludesIgnoreCase } from "@/utils/stringUtils";

export function compareActivityTypes( at1: Activity.Type, at2: Activity.Type ) {
    return at1.name.localeCompare( at2.name );
}

export function compareActivities( a1: Activity.DTO, a2: Activity.DTO ): number {
    return ( new Date( a1.startDate ).getTime() - new Date( a2.startDate ).getTime() )
        || a1.group.name.localeCompare( a2.group.name );
}

export const ActivityStatusObjects: { [ s in Activity.Status ]: ActivityStatusObject } = {
    STARTED: {
        label: "Em Andamento",
    },

    NOT_STARTED: {
        label: "Em Breve",
    },

    ENDED: {
        label: "Encerradas",
    },
};

export const ActivityStatusObjectsArray: ActivityStatusArrayObject[] = Object.entries( ActivityStatusObjects )
    .map( ( [ status, data ] ) => ( {
        ...data,
        status: status as Activity.Status,
    } ) );

export function getActivityStatusObject( status: undefined ): undefined;
export function getActivityStatusObject( status: Activity.Status ): ActivityStatusArrayObject;
export function getActivityStatusObject( status: Optional<Activity.Status> ): Optional<ActivityStatusArrayObject>;
export function getActivityStatusObject( status: Optional<Activity.Status> ): Optional<ActivityStatusArrayObject> {
    return ActivityStatusObjectsArray.find( s => s.status === status );
}

export function ActivityTypeSelect<C extends Optional<boolean>>( props: Readonly<ActivityTypeSelectProps<C>> ) {
    const cache = useCache();

    return <UniversiFormSelectInput
        { ...props }
        getOptionLabel={ at => at.name }
        getOptionUniqueValue={ at => at.id }
        sortOptions={ compareActivityTypes }
        onCreateOption={ async name => {
            const res = await UniversimeApi.ActivityType.create( { name } );
            await cache.ActivityType.update();
            return res.body;
        } }
    />
}

export function ActivityStatusSelect<C extends Optional<boolean>, M extends Optional<boolean>>( props: Readonly<ActivityStatusSelectProps<C, M>> ) {
    return <UniversiFormSelectInput
        { ...props }
        options={ ActivityStatusObjectsArray }
        getOptionLabel={ s => s.label }
        getOptionUniqueValue={ s => s.status }
        canCreateOptions={ false }
        filterOption={ ( status, text ) => stringIncludesIgnoreCase( status.label, text ) }
        sortOptions={ ( s1, s2 ) => ActivityStatusObjectsArray.indexOf( s1 ) - ActivityStatusObjectsArray.indexOf( s2 ) }
    />;
}

export type ActivityTypeSelectProps<Clearable extends Optional<boolean>> = Omit<
    UniversiFormSelectInputProps<ActivityType, false, Clearable>,
    "getOptionUniqueValue" | "getOptionLabel" | "onCreateOption" | "sortOptions"
>;

export type ActivityStatusSelectProps<Clearable extends Optional<boolean>, Multi extends Optional<boolean>> = Omit<
    UniversiFormSelectInputProps<ActivityStatusArrayObject, Multi, Clearable>,
    "options" | "getOptionUniqueValue" | "getOptionLabel" | "canCreateOptions" | "filterOption" | "sortOptions" | "createOptionLabel" | "onCreateOption"
>

export type ActivityStatusObject = {
    label: string;
};

export type ActivityStatusArrayObject = ActivityStatusObject & {
    status: Activity.Status;
};
