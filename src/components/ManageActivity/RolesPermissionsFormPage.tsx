import UniversiForm from "@/components/UniversiForm";
import { FeatureTypesToLabel, Permission, RolePermissionToLabel } from "@/utils/roles/rolesUtils";
import type { ManageActivityFormSteps, ManageActivityForm, ManageActivityProps } from "./ManageActivity";
import { UniversimeApi } from "@/services";
import { ActivityCreate_RequestDTO } from "@/services/UniversimeApi/Activity";

export function RolesPermissionsFormPage( props: Readonly<RolesPermissionsFormPageProps> ) {
    const { saveData, activitySaveData, setStep, callback } = props;

    return <UniversiForm.Root
        title="Configurar papéis"
        callback={ handleRolesForm }
        cancelButtonText="Voltar"
        skipCancelConfirmation
    >
        <RoleInputField saveData={ saveData } role="administrator" />
        <RoleInputField saveData={ saveData } role="participant" />
        <RoleInputField saveData={ saveData } role="visitor" />
    </UniversiForm.Root>;

    async function handleRolesForm( form: UniversiForm.Data<RolesPermissionForm> ) {
        if ( form.action === "CANCELED" ) {
            setStep( "ACTIVITY" );
        }

        else if ( form.action === "CONFIRMED" ) {
            const image = activitySaveData.image instanceof File
                ? await UniversimeApi.Image.upload( { isPublic: true, image: activitySaveData.image } )
                : undefined;

            const bannerImage = activitySaveData.bannerImage instanceof File
                ? await UniversimeApi.Image.upload( { isPublic: true, image: activitySaveData.bannerImage } )
                : undefined;

            const features: NonNullable<ActivityCreate_RequestDTO[ "features" ]> = Object.keys( form.body )
            .reduce( ( features, i ) => {
                const key = i as keyof RolesPermissionForm;

                const [ role, feature ] = key.split( "." ) as [ RoleInputFieldProps["role"], Role.Feature ];

                features[ role ] ??= {};
                features[ role ][ feature ] = form.body[ key ].permission;

                return features;
            }, { } as Partial<NonNullable<ActivityCreate_RequestDTO[ "features" ]>> );

            const res = await UniversimeApi.Activity.create( {
                type: activitySaveData.type.id,
                location: activitySaveData.location,
                workload: activitySaveData.workload,
                startDate: activitySaveData.startDate.getTime(),
                endDate: activitySaveData.endDate.getTime(),
                badges: activitySaveData.badges?.map( ct => ct.id ),
                name: activitySaveData.name,
                description: activitySaveData.description,
                group: activitySaveData.group.id!,
                image: image?.body,
                bannerImage: bannerImage?.body,
                features,
            } );

            return callback?.( res );
        }
    }
}

export function RoleInputField( props: Readonly<RoleInputFieldProps> ) {
    const { role, saveData: savedData } = props;

    const defaultValue: Role.Permission = role === "administrator"
        ? Permission.READ_WRITE_DELETE
        : Permission.READ;

    const name = role === "administrator"
        ? "Administradores"
        : role === "participant"
            ? "Participantes"
            : "Visitantes";

    return <div>
        <h2>Permissões para { name }</h2>
        { Object.keys( FeatureTypesToLabel )
            .filter( k => !([ "GROUP", "JOBS" ] as Role.Feature[]).includes( k as Role.Feature ) )
            .map( k => {
                const param = role + "." + k as keyof RolesPermissionForm;

                return <UniversiForm.Input.Select
                    key={ k }
                    param={ param }
                    label={ FeatureTypesToLabel[ k as Role.Feature ] }
                    options={ availablePermissions.map( makeOption ) }
                    getOptionLabel={ p => RolePermissionToLabel[ p.permission ] }
                    getOptionUniqueValue={ p => p.permission }
                    defaultValue={ { permission: savedData.current[param]?.permission ?? defaultValue } }
                    isClearable={ false }
                    isSearchable={ false }
                    onChange={ value => {
                        savedData.current ??= {};
                        savedData.current[ param ] = { permission: value.permission };
                    } }
                />
            } )
        }
    </div>;

    function makeOption( permission: Role.Permission ) {
        return {
            permission,
        };
    }
}

const availablePermissions: Role.Permission[] = [
    Permission.DISABLED,
    Permission.READ,
    Permission.READ_WRITE,
    Permission.READ_WRITE_DELETE,
];

export type RolesPermissionsFormPageProps = {
    saveData: React.MutableRefObject<Partial<RolesPermissionForm>>;
    setStep( action: React.SetStateAction<ManageActivityFormSteps> ): unknown;
    callback: ManageActivityProps[ "callback" ];
    readonly activitySaveData: ManageActivityForm;
};

export type RolesPermissionForm = {
    [ k in `${ RoleInputFieldProps["role"] }.${ Role.Feature }` ]: {
        permission: Role.Permission;
    };
};

export type RoleInputFieldProps = {
    role: "administrator" | "participant" | "visitor";
    saveData: RolesPermissionsFormPageProps[ "saveData" ];
};
