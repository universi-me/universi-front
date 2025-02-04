import { useContext, useState, useEffect, ChangeEvent } from "react";
import { useLoaderData } from "react-router-dom";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { AuthContext } from "@/contexts/Auth";
import { ActionButton } from "@/components/ActionButton/ActionButton";
import { UniversimeApi } from "@/services"

import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";
import { TextValidation } from "@/components/UniversiForm/Validation/TextValidation";
import { ValidationComposite } from "@/components/UniversiForm/Validation/ValidationComposite";

import { type OptionInMenu, renderOption } from "@/utils/dropdownMenuUtils";

import { FeatureTypes, FeatureTypesToLabel, Permission, Roles } from "@/types/Roles";

import { ProfileImage } from "@/components/ProfileImage/ProfileImage";

import { ProfileClass } from "@/types/Profile";

import { type RolesResponse, RolesFetch } from "./RolesLoader";


import "./Roles.less";
import { Group } from "@/types/Group";
import { rolesSorter } from "@/utils/roles/rolesUtils";
import { removeFalsy } from "@/utils/arrayUtils";
import { Filter } from "@/components/Filter/Filter";
import stringUtils from "@/utils/stringUtils";

type RolesPageProps = {
    group: Group | undefined;
};


const RolesPage : React.FC<RolesPageProps> = ({ group }) => {
    const auth = useContext(AuthContext);
    const data = useLoaderData() as RolesResponse;

    const [manageRolesMode, setManageRolesMode] = useState(false);

    const editMode = true;

    const [showRolesForm, setShowRolesForm] = useState(false);
    const [rolesEdit, setRolesEdit] = useState(null as Roles | null);
    const [filterParticipant, setFilterParticipant] = useState("");

    const [rows, setRows] = useState(null as Roles[] | null);

    const [participants, setParticipants] = useState(null as ProfileClass[] | null);

    const CHANGE_PAPER_OPTIONS: OptionInMenu<ProfileClass>[] = rows
        ?.filter(r => r.canBeAssigned)
        .map((roles) => ({
            text: roles.name,
            onSelect(data) {
                UniversimeApi.Roles.assign({rolesId: roles.id, groupId: group!?.id, profileId: data.id}).then(
                    refreshPage
                );
            },
        })) ?? [];

    useEffect(() => {
        setValuesWithData(data);
        refreshPage();
    }, [data]);
    
    const handleFeatureCheckboxChange = (e : ChangeEvent<HTMLSelectElement>, row : Roles, column : FeatureTypes) => {
        UniversimeApi.Feature.toggle({rolesId: row.id, feature: column, value: parseInt(e.target.value)}).then(
            refreshPage
        );
    };

    const isFeatureChecked = (row : Roles, column : FeatureTypes) => {
        return row.permissions[column];
    };

    return <div id="roles-settings">

            { showRolesForm &&
                <UniversiForm
                    formTitle={rolesEdit == null ? "Criar Papel" : "Editar Papel"}
                    objects={[
                        {
                            DTOName: "name", label: "Nome", type: FormInputs.TEXT, value: rolesEdit?.name, required: true,
                            charLimit: 30,
                            validation: new ValidationComposite<string>().addValidation(new TextValidation())
                        }, {
                            DTOName: "description", label: "Descrição", type: FormInputs.LONG_TEXT, value: rolesEdit?.description, required: false,
                            charLimit: 130
                        },
                        {
                            DTOName: "groupId", label: "id", type: FormInputs.HIDDEN,
                            value: group?.id
                        },
                        {
                            DTOName: "rolesId", label: "id", type: FormInputs.HIDDEN,
                            value: rolesEdit?.id
                        },
                    ]}
                    requisition={rolesEdit ? UniversimeApi.Roles.edit : UniversimeApi.Roles.create}
                    callback={async () => {setRolesEdit(null); setShowRolesForm(false); await refreshPage()}}
                />
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
                        <th key={key}>{FeatureTypesToLabel[key as FeatureTypes]}</th>
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
              value={isFeatureChecked(row, key as FeatureTypes)}
              onChange={(e) => handleFeatureCheckboxChange(e, row, key as FeatureTypes)}
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
            const isOwnerGroup = group?.admin.id === profile.id;

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
                            { profile.roles?.name }
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
        const newData = await RolesFetch(group!.id);
        setValuesWithData(newData);
    }

    function setValuesWithData(data: RolesResponse) {
        setRows((data.roles ?? [])
            .sort(rolesSorter)
        );
        setParticipants(data.participants
            ?.map(ProfileClass.new)
            .sort((a, b) => {
                if (a.roles && b.roles && a.roles !== b.roles)
                    return rolesSorter(a.roles, b.roles)

                return ProfileClass.compare(a, b);
            }) ?? []
        );
    }
}

export default RolesPage;
