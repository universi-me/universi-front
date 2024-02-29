import { useReducer, useContext, useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import * as Switch from "@radix-ui/react-switch"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { AuthContext } from "@/contexts/Auth";
import { SettingsTitle, SettingsDescription, type RolesPageLoaderResponse, RolesPageFetch } from "@/pages/Settings";
import { ActionButton } from "@/components/ActionButton/ActionButton";
import UniversimeApi from "@/services/UniversimeApi";
import * as SwalUtils from "@/utils/sweetalertUtils";

import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";
import { TextValidation } from "@/components/UniversiForm/Validation/TextValidation";
import { ValidationComposite } from "@/components/UniversiForm/Validation/ValidationComposite";

import { type OptionInMenu, renderOption } from "@/utils/dropdownMenuUtils";

import { Feature, Paper, PaperFeature } from "@/types/Paper";

import { ProfileImage } from "@/components/ProfileImage/ProfileImage";

import { ProfileClass, type Profile } from "@/types/Profile";

import { ICON_EDIT_BLACK } from '@/utils/assets';

import { type PaperResponse, PaperFetch, PaperLoader } from "./PaperLoader";


import "./Paper.less";


export function PaperPage() {
    const auth = useContext(AuthContext);
    const data = useLoaderData() as PaperResponse;
    const navigate = useNavigate();

    const [managePaperMode, setManagePaperMode] = useState(false);

    const [editMode, setEditMode] = useState(false);

    const [showPaperForm, setShowPaperForm] = useState(false);
    const [paperEdit, setPaperEdit] = useState(null as Paper | null);

    const [showFeatureForm, setShowFeatureForm] = useState(false); 
    const [featureEdit, setFeaureEdit] = useState(null as Feature | null);

    const [rows, setRows] = useState(null as Paper[] | null);
    const [columns, setColumns] = useState(null as Feature[] | null);

    const [participants, setParticipants] = useState(null as ProfileClass[] | null);

    if (data.papers === undefined) {
        SwalUtils.fireModal({
            title: "Erro ao carregar papéis dos usuários",
            text: "Não foi possível carregar os papéis dos usuários. Tente novamente mais tarde.",

            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonText: "Voltar",
        }).then(v => navigate("/settings"));

        return null;
    }

    const CHANGE_PAPER_OPTIONS: OptionInMenu<Paper>[] = rows!?.map((paper) => ({
        text: paper.name,
        onSelect(data) {
            UniversimeApi.Paper.assign({paperId: paper.id, profileId: data.id}).then(
                refreshPage
            );
        },
    }));

    useEffect(() => {
        setValuesWithData(data);
    }, [data]);
    
    const handleFeatureCheckboxChange = (e : any, row : Paper, column : Feature) => {
        UniversimeApi.Feature.toggle({paperId: row.id, featureId: column.id, value: e.target.value}).then(
            refreshPage
        );
    };

    const isFeatureChecked = (row : Paper, column : Feature) => {
        let paperFeature : PaperFeature | undefined = row!?.features!?.findLast(f => f.feature == column.id);
        if(paperFeature) {
            return paperFeature.permission;
        }
        return column.defaultPermission;
    };

    return <div id="paper-settings">
        <SettingsTitle>Papéis dos usuários</SettingsTitle>
        <SettingsDescription>Aqui você pode gerenciar os papéis dos usuários para acessar as funcionalidades da plataforma.</SettingsDescription>

        { managePaperMode ? <div>
        <p className="edit_button" onClick={() => setEditMode(!editMode)} >  
            <img src={ICON_EDIT_BLACK} alt="Editar"/>
        </p>
        <br/>
        <p className="buttons">
            <ActionButton name="Atribuir Papéis" buttonProps={{
                onClick() { setManagePaperMode(false) },
                className: "create-new-filter",
            }}/>
            <ActionButton name="Criar Papel de Usuário" buttonProps={{
                onClick() { setShowPaperForm(true) },
                className: "create-new-filter",
            }}/>
            <ActionButton name="Criar Funcionalidade" buttonProps={{
                onClick() { setShowFeatureForm(true) },
                className: "create-new-filter",
            }}/>
        </p>

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
                            DTOName: "id", label: "id", type: FormInputs.HIDDEN,
                            value: paperEdit?.id
                        },
                    ]}
                    requisition={paperEdit ? UniversimeApi.Paper.edit : UniversimeApi.Paper.create}
                    callback={()=>{setPaperEdit(null); setShowPaperForm(false); refreshPage()}}
                />
            }

            { showFeatureForm &&
                <UniversiForm
                    formTitle={featureEdit == null ? "Criar Funcionalidade" : "Editar Funcionalidade"}
                    objects={[
                        {
                            DTOName: "name", label: "Nome", type: FormInputs.TEXT, value: featureEdit?.name, required: true,
                            charLimit: 30,
                            validation: new ValidationComposite<string>().addValidation(new TextValidation())
                        }, {
                            DTOName: "description", label: "Descrição", type: FormInputs.LONG_TEXT, value: featureEdit?.description, required: false,
                            charLimit: 130,
                        },
                        {
                            DTOName: "defaultValue", label: "Habilitada por padrão", type: FormInputs.NUMBER, value: featureEdit?.defaultPermission, required: false,
                        },
                        {
                            DTOName: "id", label: "id", type: FormInputs.HIDDEN,
                            value: featureEdit?.id
                        },
                    ]}
                    requisition={featureEdit ? UniversimeApi.Feature.edit : UniversimeApi.Feature.create}
                    callback={()=>{setFeaureEdit(null); setShowFeatureForm(false); refreshPage()}}
                />
            }

        <section className="email-filter-list">
            
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      {columns!?.map((column) => (
                        <th key={column.id} title={column.description}>{column.name} { editMode &&
                            <button onClick={()=>{ setFeaureEdit(column); setShowFeatureForm(true); }} className={`edit-button ${editMode ? 'active' : ''}`}>
                                <div className={`icon-edit ${editMode ? 'active' : ''}`}>
                                    <i className="bi bi-pencil-fill" />
                                </div>
                            </button>
                        }</th>
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
                        {columns!.map((column) => (
                          <td key={column.id}>
                            <select
              value={isFeatureChecked(row, column)}
              onChange={(e) => handleFeatureCheckboxChange(e, row, column)}
            >
              <option value="1">Desabilitada</option>
              <option value="2">Visualizar</option>
              <option value="3">Visualizar e Modificar</option>
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
                            { profile.paper!?.name! }
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
        const newData = await PaperFetch(auth.organization!.id);
        setValuesWithData(newData);
    }

    function setValuesWithData(data : any) {
        setColumns(data!.features!.sort((a :any,b : any) => a.name.localeCompare(b.name)) );
        setRows(data!.papers!.sort((a :any,b : any) => a.name.localeCompare(b.name)) );
        setParticipants(data!.participants!?.map(ProfileClass.new));
    }
}
