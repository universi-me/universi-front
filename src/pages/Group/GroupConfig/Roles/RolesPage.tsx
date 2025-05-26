import { useContext, useState, useEffect, ChangeEvent } from "react";
import { useLoaderData } from "react-router-dom";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { AuthContext } from "@/contexts/Auth";
import { ActionButton } from "@/components/ActionButton/ActionButton";
import { UniversimeApi } from "@/services"

import UniversiForm from "@/components/UniversiForm2";

import { type OptionInMenu, renderOption } from "@/utils/dropdownMenuUtils";

import { ProfileImage } from "@/components/ProfileImage/ProfileImage";

import { ProfileClass } from "@/types/Profile";

import { type RolesResponse, RolesFetch } from "./RolesLoader";


import "./Roles.less";
import { rolesSorter, Permission, FeatureTypesToLabel } from "@/utils/roles/rolesUtils";
import { removeFalsy } from "@/utils/arrayUtils";
import { Filter } from "@/components/Filter/Filter";
import stringUtils from "@/utils/stringUtils";

type RolesPageProps = {
    group: Group.DTO | undefined;
};


const RolesPage : React.FC<RolesPageProps> = ({ group }) => {
    const auth = useContext(AuthContext);
    const data = useLoaderData() as RolesResponse;

    const [manageRolesMode, setManageRolesMode] = useState(false);

    const editMode = true;

    const [showRolesForm, setShowRolesForm] = useState(false);
    const [rolesEdit, setRolesEdit] = useState(null as Role.DTO | null);
    const [filterParticipant, setFilterParticipant] = useState("");

    const [rows, setRows] = useState(null as Role.DTO[] | null);

    const [participants, setParticipants] = useState(null as ProfileClass[] | null);

    const CHANGE_PAPER_OPTIONS: OptionInMenu<ProfileClass>[] = rows
        ?.filter(r => r.canBeAssigned)
        .map((roles) => ({
            text: roles.name,
            onSelect(data) {
                UniversimeApi.Role.assign( roles.id, data.id ).then(
                    refreshPage
                );
            },
        })) ?? [];

    useEffect(() => {
        setValuesWithData(data);
        refreshPage();
    }, [data]);
    
    const handleFeatureCheckboxChange = (e : ChangeEvent<HTMLSelectElement>, row : Role.DTO, column : Role.Feature) => {
        const features: { [k in Role.Feature]?: Role.Permission } = {};
        features[ column ] = parseInt( e.target.value ) as Role.Permission;

        UniversimeApi.Role.update( { rolesId: row.id, features } ).then(
            refreshPage
        );
    };

    const isFeatureChecked = (row : Role.DTO, column : Role.Feature) => {
        return row.permissions[column];
    };

    return <div id="roles-settings">

            { showRolesForm &&
                <UniversiForm.Root title={ rolesEdit == null ? "Criar Papel" : "Editar Papel" } callback={ handleForm }>
                    <UniversiForm.Input.Text
                        param="name"
                        label="Nome"
                        defaultValue={ rolesEdit?.name }
                        required
                        maxLength={ 30 }
                    />

                    <UniversiForm.Input.Text
                        param="description"
                        label="Descrição"
                        defaultValue={ rolesEdit?.description }
                        isLongText
                        maxLength={ 130 }
                    />
                </UniversiForm.Root>
            }

        { manageRolesMode ? <div>
            
        <p className="buttons">
            <ActionButton name="Atribuir Papéis" buttonProps={{
                onClick() { setManageRolesMode(false) },
                className: "create-new-filter",
            }}/>
            <ActionButton name="Criar Papel de Usuário" buttonProps={{
                onClick() { setShowRolesForm(true) },
                className: "create-new-filter",
            }}/>
        </p>

        <section className="email-filter-list">

        
            
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      { Object.keys(FeatureTypesToLabel).map((key, index, value) => (
                        <th key={key}>{FeatureTypesToLabel[key as Role.Feature]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows!?.map((row) => (
                      <tr key={row.id} className="row-disabled">
                        <td title={row.description}>{row.name} { (editMode && row.canBeEdited) &&
                            <button onClick={()=>{ setRolesEdit(row); setShowRolesForm(true); }} className={`edit-button ${editMode && row.canBeEdited ? 'active' : ''}`}>
                                <div className={`icon-edit ${editMode ? 'active' : ''}`}>
                                    <i className="bi bi-pencil-fill" />
                                </div>
                            </button>
                        }</td>
                        {Object.keys(FeatureTypesToLabel).map((key, index, value) => (
                          <td key={key}>
                            <select
              value={isFeatureChecked(row, key as Role.Feature)}
              onChange={(e) => handleFeatureCheckboxChange(e, row, key as Role.Feature)}
            >
              <option value={ Permission.DISABLED }>Desabilitada</option>
              <option value={ Permission.READ }>Ver</option>
              <option value={ Permission.READ_WRITE }>Ver e Editar</option>
              <option value={ Permission.READ_WRITE_DELETE }>Ver, Editar e Apagar</option>
            </select>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
            
            

                

        </section>
        
        </div> : <div>

            <div className="edit_button">
                <ActionButton name="Gerenciar Papéis" buttonProps={{
                    onClick() { setManageRolesMode(true) },
                    className: "create-new-filter",
                }}/>

                <Filter placeholderMessage="Filtrar participantes" setter={setFilterParticipant} />
            </div>
            <br/>
            <section id="participants-list">
        { participants?.filter(p => stringUtils.includesIgnoreCase(p.fullname ?? "", filterParticipant)).map(profile => {
            const isOwnProfile = auth.profile!.id === profile.id;
            const isOwnerGroup = group?.admin?.id === profile.id;

            const disable = isOwnProfile || isOwnerGroup;
            const title = isOwnProfile 
                ? "Você não pode alterar seu próprio papel"
                : isOwnerGroup
                    ? "O papel do dono do grupo não pode ser alterado"
                    : undefined;

            const options = removeFalsy(CHANGE_PAPER_OPTIONS.map(def => renderOption(profile, def)));

            if (options.length === 0)
                return null;

            return <div className="profile-item" key={profile.id}>
                <ProfileImage imageUrl={profile.imageUrl} name={profile.fullname} className="profile-image" />
                <div className="info">
                    <h2 className="profile-name">{profile.fullname}</h2>
                    <p className="profile-bio">{profile.bio}</p>
                </div>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild disabled={disable} title={title}>
                        <button type="button" className="set-role-trigger">
                            { profile.role?.name }
                            <span className="bi"/>
                        </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Content className="set-role-menu">
                        { options }
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </div>
        }) }
        </section>

        

        </div>
    }

    </div>

    async function refreshPage() {
        const newData = await RolesFetch(group!.id!);
        setValuesWithData(newData);
    }

    function setValuesWithData(data: RolesResponse) {
        setRows((data.roles ?? [])
            .sort(rolesSorter)
        );
        setParticipants(data.participants
            ?.map(ProfileClass.new)
            .sort((a, b) => {
                if (a.role && b.role && a.role !== b.role)
                    return rolesSorter(a.role, b.role)

                return ProfileClass.compare(a, b);
            }) ?? []
        );
    }

    async function handleForm( form: RolesForm ) {
        if ( !form.confirmed ) {
            close();
            return;
        }

        const body = {
            name: form.body.name,
            description: form.body.description,
        };

        if ( rolesEdit )
            await UniversimeApi.Role.update( { ...body, rolesId: rolesEdit.id } );
        else
            await UniversimeApi.Role.create( { ...body, group: group!.id! } );

        await refreshPage();
        close();

        function close() {
            setRolesEdit( null );
            setShowRolesForm( false );
        }
    }
}

export default RolesPage;

type RolesForm = UniversiForm.Data<{
    name: string;
    description: string;
}>;
