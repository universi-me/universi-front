import { useReducer, useContext, useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { AuthContext } from "@/contexts/Auth";
import { ActionButton } from "@/components/ActionButton/ActionButton";
import UniversimeApi from "@/services/UniversimeApi";

import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";
import { TextValidation } from "@/components/UniversiForm/Validation/TextValidation";
import { ValidationComposite } from "@/components/UniversiForm/Validation/ValidationComposite";

import { type OptionInMenu, renderOption } from "@/utils/dropdownMenuUtils";

import { FeatureTypesToLabel, type FeatureTypes, Roles, RolesFeature, Permission } from "@/types/Roles";

import { ProfileImage } from "@/components/ProfileImage/ProfileImage";

import { ProfileClass, type Profile } from "@/types/Profile";

import { type RolesResponse, RolesFetch, RolesLoader } from "./RolesLoader";


import "./Roles.less";
import { Group } from "@/types/Group";

type PaperPageProps = {
    group: Group | undefined;
};


const RolesPage : React.FC<PaperPageProps> = ({ group }) => {
    const auth = useContext(AuthContext);
    const data = useLoaderData() as RolesResponse;
    const navigate = useNavigate();

    const [managePaperMode, setManagePaperMode] = useState(false);

    const [editMode, setEditMode] = useState(true);

    const [showPaperForm, setShowPaperForm] = useState(false);
    const [paperEdit, setPaperEdit] = useState(null as Roles | null);

    const [rows, setRows] = useState(null as Roles[] | null);
    const [columns, setColumns] = useState(null as string[] | null);

    const [participants, setParticipants] = useState(null as ProfileClass[] | null);

    const CHANGE_PAPER_OPTIONS: OptionInMenu<Roles>[] = rows!?.map((roles) => ({
        text: roles.name,
        onSelect(data) {
            UniversimeApi.Roles.assign({rolesId: roles.id, profileId: data.id}).then(
                refreshPage
            );
        },
    }));

    useEffect(() => {
        setValuesWithData(data);
        refreshPage();
    }, [data]);
    
    const handleFeatureCheckboxChange = (e : any, row : Roles, column : any) => {
        UniversimeApi.Feature.toggle({rolesId: row.id, feature: column, value: e.target.value}).then(
            refreshPage
        );
    };

    const isFeatureChecked = (row : Roles, column : any) => {
        let paperFeature = (row!?.rolesFeatures as any)?.findLast((feature: { featureType: any; }) => feature.featureType == column);
        if(paperFeature) {
            return paperFeature.permission;
        }
        return Permission.DEFAULT;
    };

    return <div id="paper-settings">

            { showPaperForm &&
                <UniversiForm
                    formTitle={paperEdit == null ? "Criar Papel" : "Editar Papel"}
                    objects={[
                        {
                            DTOName: "name", label: "Nome", type: FormInputs.TEXT, value: paperEdit?.name, required: true,
                            charLimit: 30,
                            validation: new ValidationComposite<string>().addValidation(new TextValidation())
                        }, {
                            DTOName: "description", label: "Descrição", type: FormInputs.LONG_TEXT, value: paperEdit?.description, required: false,
                            charLimit: 130,
                        },
                        {
                            DTOName: "groupId", label: "id", type: FormInputs.HIDDEN,
                            value: group?.id
                        },
                        {
                            DTOName: "rolesId", label: "id", type: FormInputs.HIDDEN,
                            value: paperEdit?.id
                        },
                    ]}
                    requisition={paperEdit ? UniversimeApi.Roles.edit : UniversimeApi.Roles.create}
                    callback={()=>{setPaperEdit(null); setShowPaperForm(false); refreshPage()}}
                />
            }

            <p/>
            <br/>

        { managePaperMode ? <div>
            
        <p className="buttons">
            <ActionButton name="Atribuir Papéis" buttonProps={{
                onClick() { setManagePaperMode(false) },
                className: "create-new-filter",
            }}/>
            <ActionButton name="Criar Papel de Usuário" buttonProps={{
                onClick() { setShowPaperForm(true) },
                className: "create-new-filter",
            }}/>
        </p>

        <section className="email-filter-list">

        
            
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      { Object.keys(FeatureTypesToLabel).map((key, index, value) => (
                        <th key={key}>{(FeatureTypesToLabel as any)[key]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows!?.map((row) => (
                      <tr key={row.id}>
                        <td title={row.description}>{row.name} { editMode &&
                            <button onClick={()=>{ setPaperEdit(row); setShowPaperForm(true); }} className={`edit-button ${editMode ? 'active' : ''}`}>
                                <div className={`icon-edit ${editMode ? 'active' : ''}`}>
                                    <i className="bi bi-pencil-fill" />
                                </div>
                            </button>
                        }</td>
                        {Object.keys(FeatureTypesToLabel).map((key, index, value) => (
                          <td key={key}>
                            <select
              value={isFeatureChecked(row, key)}
              onChange={(e) => handleFeatureCheckboxChange(e, row, key)}
            >
              <option value={ Permission.DISABLED }>Desabilitada</option>
              <option value={ Permission.READ }>Visualizar</option>
              <option value={ Permission.READ_WRITE }>Visualizar e Modificar</option>
              <option value={ Permission.READ_WRITE_DELETE }>Visualizar, Modificar e Apagar</option>
            </select>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
            
            

                

        </section>
        
        </div> : <div>

            <p className="edit_button">
                <ActionButton name="Gerenciar Papéis" buttonProps={{
                    onClick() { setManagePaperMode(true) },
                    className: "create-new-filter",
                }}/>
            </p>
            <br/>
            <section id="participants-list">
        { participants!?.map(profile => {
            const isOwnProfile = auth.profile!.id === profile.id;

            return <div className="profile-item" key={profile.id}>
                <ProfileImage imageUrl={profile.imageUrl} className="profile-image" />
                <div className="info">
                    <h2 className="profile-name">{profile.fullname}</h2>
                    <p className="profile-bio">{profile.bio}</p>
                </div>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild /*disabled={isOwnProfile}*/ title={isOwnProfile ? "Você não pode alterar seu próprio nível de acesso" : undefined}>
                        <button type="button" className="set-role-trigger">
                            { profile.roles!?.name! }
                            <span className="bi"/>
                        </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Content className="set-role-menu">
                        { CHANGE_PAPER_OPTIONS.map(def => renderOption(profile as any, def)) }
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

    function setValuesWithData(data : any) {
        setColumns((data!.features! ?? []).sort((a :any,b : any) => a.name.localeCompare(b.name)) );
        setRows((data!.roles! ?? []).sort((a :any,b : any) => a.name.localeCompare(b.name)) );
        setParticipants(data!.participants!?.map(ProfileClass.new));
    }
}

export default RolesPage;