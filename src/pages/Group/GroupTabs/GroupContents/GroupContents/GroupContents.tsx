import { useContext, useEffect, useMemo, useReducer, useState } from "react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import UniversimeApi from "@/services/UniversimeApi";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { EMPTY_LIST_CLASS, GroupContentMaterials, GroupContext } from "@/pages/Group";
import { ProfileImage } from "@/components/ProfileImage/ProfileImage";
import { ManageContent } from "@/components/ManageContent";
import { type OptionInMenu, renderOption, hasAvailableOption } from "@/utils/dropdownMenuUtils";

import type { Folder } from "@/types/Capacity";
import "./GroupContents.less";
import { Filter } from "@/components/Filter/Filter";
import { ActionButton } from "@/components/ActionButton/ActionButton";
import { AuthContext } from "@/contexts/Auth";
import { UniversiModal } from "@/components/UniversiModal";
import { ProfileClass } from "@/types/Profile";
import { makeClassName } from "@/utils/tsxUtils";
import { arrayRemoveEquals } from "@/utils/arrayUtils";
import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";
import useCanI from "@/hooks/useCanI";
import { Permission } from "@/types/Roles";

function SelectPeople(){
    const groupContext = useContext(GroupContext)
    const authContext = useContext(AuthContext)

    const [currentlyAssigned, setCurrentlyAssigned] = useState<ProfileClass[]>([]);
    const [selectedProfiles, selectedProfilesDispatch] = useReducer(selectProfileReducer, []);
    const [filterName, setFilterName] = useState("");

    const possibleAssignments = useMemo(() => {
        return [...groupContext?.participants ?? []]
            .filter(a => !a.user.needProfile && a.user.name !== authContext.profile?.user.name)
            .sort((a, b) => a.fullname!.localeCompare(b.fullname!));
    }, [groupContext?.participants, authContext.profile]);

    useEffect(() => {
        if (!groupContext?.assignFolder) return;

        UniversimeApi.Capacity.folderAssignedTo({ reference: groupContext.assignFolder.reference })
            .then((res) => { setCurrentlyAssigned(res.body?.profilesIds.map(ProfileClass.new) ?? []) });
    }, [groupContext?.assignFolder]);

    useEffect(() => {
        selectedProfilesDispatch({
            action: "SET",
            to: currentlyAssigned.map(ProfileClass.new),
        });
    }, [currentlyAssigned]);

    if (!groupContext?.assignFolder) return null;

    const assignedTo = arrayRemoveEquals(selectedProfiles, currentlyAssigned, (a, b) => a.id === b.id);
    const unassignedTo = arrayRemoveEquals(currentlyAssigned, selectedProfiles, (a, b) => a.id === b.id);

    const canSave = assignedTo.length > 0 || unassignedTo.length > 0;

    const shownParticipants = possibleAssignments
        .filter(a => a.nameIncludesIgnoreCase(filterName));

    async function makeRequest(){
        if(groupContext?.assignFolder == undefined)
            return;

        if (assignedTo.length) {
            await UniversimeApi.Capacity.assignContent({
                folderId: groupContext.assignFolder.id,
                profilesIds: assignedTo.map(p => p.id),
            });
        }

        if (unassignedTo.length) {
            UniversimeApi.Capacity.unassignContent({
                folderId: groupContext.assignFolder.id,
                profilesIds: unassignedTo.map(p => p.id),
            })
        }

        groupContext.setAssignFolder(undefined);
        groupContext.refreshData();
    }

    function selectProfileReducer(state: ProfileClass[], action: SelectProfileAction): ProfileClass[] {
        switch (action.action) {
            case "ADD":
                return state.concat([action.profile]);
            case "REMOVE":
                return state.filter(p => p.id !== action.profile.id);
            case "SET":
                return action.to;
        }
    }

    function handleAssignToAll() {
        if (selectedProfiles.length === possibleAssignments.length)
            selectedProfilesDispatch({action: "SET", to: []})
        else
            selectedProfilesDispatch({ action: "SET", to: possibleAssignments })
    }

    return(
        <UniversiModal>
            <div id="universi-form-container" className="assign-content-modal" >
                <div className="universi-form-container fields">

                    <div className="header">
                        <img src="/assets/imgs/create-content.png" />
                        <h1 className="title">Atribuir Conteúdo </h1>
                    </div>

                    <fieldset>
                        <div className="legend-wrapper">
                            <legend>Pessoas</legend>
                            <Filter setter={setFilterName} placeholderMessage="Pesquisar por alguém..." />
                        </div>
                        <div id="assign-content-to-profile">
                            { shownParticipants.length > 0 ? shownParticipants
                                .map(p => {
                                const isSelected = !!selectedProfiles.find(i => i.id === p.id);

                                return <div className="participant-item" key={p.id}>
                                    <img src={p.imageUrl} alt="" className="profile-picture" />
                                    <div className="profile-data">
                                        <h2 className="profile-name">{ p.fullname }</h2>
                                    </div>
                                    <button className="assign-profile" onClick={() => { selectedProfilesDispatch({ action: isSelected ? "REMOVE" : "ADD", profile: p }) }}>
                                        <i className={makeClassName("bi", isSelected ? "bi-check-circle-fill" : "bi-check-circle")} />
                                    </button>
                                </div>
                            }) : <p>{ possibleAssignments.length > 0 ? "Nenhum participante encontrado nessa busca" : "Nenhum participante no grupo" }</p> }
                        </div>
                    </fieldset>
                    <section className="operation-buttons">
                        <button type="button" className="submit-button" style={{width: "fit-content", padding: "0.75rem"}} onClick={handleAssignToAll}>
                            <i className="bi bi-people-fill"/> Todas as pessoas do grupo
                        </button>
                        <button type="button" className="cancel-button" onClick={() => groupContext?.setAssignFolder(undefined)}>
                            <i className="bi bi-x-circle-fill" /> Cancelar
                        </button>
                        <button type="button" className="submit-button" onClick={makeRequest} disabled={!canSave} title={canSave ? undefined : "Preencha os dados antes de salvar"}>
                            <i className="bi bi-check-circle-fill" /> Salvar
                        </button>
                    </section>
                </div>
            </div>
        </UniversiModal>
    )
}

export function GroupContents() {
    const groupContext = useContext(GroupContext);
    const [filterContents, setFilterContents] = useState<string>("");
    const [importContentAvailable, setImportContentAvailable] = useState<Folder[]>();
    const [duplicateContentId, setDuplicateContentId] = useState<string | undefined> ();

    const canI = useCanI();

    if (!groupContext)
        return null;

    if (groupContext.currentContent) {
        return <GroupContentMaterials />;
    }

    const OPTIONS_DEFINITION: OptionInMenu<Folder>[] = [
        {
            text: "Editar",
            biIcon: "pencil-fill",
            onSelect(data) {
                groupContext.setEditContent(data);
            },
            hidden() {
                return !groupContext?.group.canEdit;
            },
        },
        {
            text: "Atribuir",
            biIcon: "send-fill",
            onSelect(data) {
                groupContext.setAssignFolder(data)
            },
            hidden() {
                return !groupContext?.group.canEdit;
            }
        },
        {
            text: "Favoritar",
            biIcon: "star-fill",
            onSelect(data) {
                UniversimeApi.Capacity.favoriteFolder({ folderId: data.id })
                .then(res => {res.success && groupContext.refreshData()});
            },
            hidden(data) {
                return !!data.favorite;
            },
        },
        {
            text: "Desfavoritar",
            biIcon: "star-half",
            hidden(data) {
                return !data.favorite;
            },
            onSelect(data) {
                UniversimeApi.Capacity.unfavoriteFolder({ folderId: data.id })
                .then(res => {res.success && groupContext.refreshData()});
            },
        },
        {
            text: "Remover do grupo",
            biIcon: "trash-fill",
            className: "delete",
            onSelect: handleDeleteContent,
            hidden() {
                return !groupContext?.group.canEdit;
            },
        },
        {
            text: "Criar uma cópia",
            biIcon: "folder-plus",
            className: "duplicate",
            onSelect: (data) => {
                setDuplicateContentId(data.id)
            },
            hidden(){
                return !groupContext.group.canEdit;
            },
        }
    ]

    return (
        <section id="contents" className="group-tab">
            <div className="heading top-container">
                <div className="go-right">
                    <Filter setter={setFilterContents} placeholderMessage={`Buscar em Conteúdos ${groupContext.group.name}`}/>
                    {  
                        canI("CONTENT", Permission.READ_WRITE, groupContext.group) &&
                        <ActionButton name="Adicionar conteúdo" buttonProps={{ onClick: handleAddContent }} />
                    }
                </div>
            </div>

            <div className="content-list tab-list"> { makeContentList(groupContext.folders, filterContents) } </div>

            {
                groupContext.editContent !== undefined &&
                <ManageContent content={groupContext.editContent} group={groupContext.group} afterSave={()=>{groupContext.setEditContent(undefined); groupContext.refreshData() }} />
            }
            {
                groupContext.assignFolder !== undefined
                ?
                <SelectPeople/>
                :
                duplicateContentId !== undefined
                ?
                <UniversiForm
                callback={() => {setDuplicateContentId(undefined); groupContext.refreshData()}}
                formTitle="Criar uma cópia"
                objects={[
                    {
                        DTOName : "targetGroupId", 
                        label : "Copiar para: ",
                        type: FormInputs.SELECT_SINGLE,
                        value: {value : groupContext.group.id, label: groupContext.group.name},
                        options : groupContext.loggedData.groups.filter(g => g.canEdit).map((g) => ({value: g.id, label: g.name}))
                    },
                    {
                        DTOName: "contentId",
                        label: "",
                        value: duplicateContentId,
                        type: FormInputs.HIDDEN
                    }
                ]}
                requisition={UniversimeApi.Capacity.duplicateContent}
                saveButtonText="Copiar"
                />
                :
                <></>
            }
            {
                importContentAvailable !== undefined && <ImportContent
                    availableContents={importContentAvailable}
                    resetContents={() => setImportContentAvailable(undefined)}
                />
            }
        </section>
    );


    function makeContentList(contents: Folder[], filter: string) {
        if (contents.length === 0) {
            return <p className={EMPTY_LIST_CLASS}>Esse grupo não possui conteúdos.</p>
        }

        const filteredContents = filter.length === 0
            ? contents
            : contents.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));

        if (filteredContents.length === 0) {
            return <p className={EMPTY_LIST_CLASS}>Nenhum conteúdo encontrado com a pesquisa.</p>
        }

        filteredContents.sort((a, b) => a.name.localeCompare(b.name));

        return filteredContents
            .map(renderContent);
    }

    function selectContent(content: Folder) {
        groupContext?.setCurrentContent(content)
        window.location.hash = "contents" + "/" + content.id;
    }

    function renderContent(content: Folder) {
        const imageUrl = content.image?.startsWith("/")
            ? `${import.meta.env.VITE_UNIVERSIME_API}${content.image}`
            : content.image;

        return (
            <div className="content-item tab-item" key={content.id}>
                {
                    imageUrl
                    ?
                    <ProfileImage imageUrl={imageUrl} className="content-image" onClick={() => selectContent(content)} />
                    :
                    <ProfileImage imageUrl={"/assets/imgs/default-content.png"} className="content-image default-image" onClick={() => selectContent(content)} />
                }

                <div className="info">
                    <div className="content-name-wrapper">
                        <h2 className="content-name" onClick={() => selectContent(content)}>{content.name}</h2>

                        { !hasAvailableOption(OPTIONS_DEFINITION, content) ? null :
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <button className="content-options-button">
                                    <i className="bi bi-three-dots-vertical" />
                                </button>
                            </DropdownMenu.Trigger>

                            <DropdownMenu.Content className="content-options" side="left">
                                { OPTIONS_DEFINITION.map(def => renderOption(content, def)) }
                                <DropdownMenu.Arrow className="content-options-arrow" height=".5rem" width="1rem" />
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                        }
                    </div>
                    <p className="content-description">{content.description}</p>
                </div>
            </div>
        );
    }

    function handleDeleteContent(content: Folder) {
        SwalUtils.fireModal({
            showCancelButton: true,

            cancelButtonText: "Cancelar",
            confirmButtonText: "Excluir",
            confirmButtonColor: "var(--alert-color)",

            text: "Tem certeza que deseja remover este conteúdo do grupo?",

            icon: "warning",
        }).then(res => {
            if (res.isConfirmed) {
                UniversimeApi.Capacity.editFolder({ id: content.id, removeGrantedAccessGroupByIds: groupContext!.group.id })
                    .then(res => {
                        if (!res.success)
                            return;

                        groupContext?.refreshData();
                    });
            }
        });
    }

    async function handleAddContent() {
        const response = await SwalUtils.fireModal({
            title: `Adicionar um conteúdo à "${groupContext!.group.name}"?`,

            showCancelButton: true,
            showDenyButton: true,

            confirmButtonText: "Criar novo conteúdo",
            denyButtonText:   "Importar conteúdo já existente",
            cancelButtonText: "Cancelar",
        });

        if (response.isConfirmed)
            groupContext!.setEditContent(null);

        if (response.isDenied) {
            UniversimeApi.Capacity.folderList()
            .then(res => {
                if (res.success) setImportContentAvailable(res.body.folders);
            })
        }
    }
}

type SelectProfileAction = {
    action: "ADD" | "REMOVE";
    profile: ProfileClass;
} | {
    action: "SET";
    to: ProfileClass[];
};

type ImportContentProps = {
    availableContents: Folder[];
    resetContents(): any;
};
function ImportContent(props: Readonly<ImportContentProps>) {
    const groupContext = useContext(GroupContext);
    const { availableContents, resetContents } = props;

    const importOptions = useMemo(() => {
        return availableContents
            // filter - not already in group
            .filter(c => !groupContext?.folders.find(groupContent => groupContent.id === c.id))

            .map(c => ({label: c.name, value: c.id}))
            .sort((c1, c2) => c1.label.localeCompare(c2.label));
    }, availableContents)

    return <UniversiForm
        formTitle="Importar conteúdos"
        objects={[
        {
            label: "Conteúdos disponíveis", DTOName: "contentIds", type: FormInputs.SELECT_MULTI,
            canCreate: false, required: true,
            options: importOptions
        },
        ]}
        requisition={handleImport}
        callback={resetContents}
    />;

    async function handleImport(formData: {contentIds: string[]}) {
        const { contentIds } = formData;

        await Promise.all(contentIds.map( cId => UniversimeApi.Capacity.editFolder({
            id: cId,
            addGrantedAccessGroupByIds: groupContext!.group.id,
        })));

        await groupContext!.refreshData();
    }
}
