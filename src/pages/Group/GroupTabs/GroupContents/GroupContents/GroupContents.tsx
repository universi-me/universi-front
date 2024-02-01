import { useContext, useState } from "react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import UniversimeApi from "@/services/UniversimeApi";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { EMPTY_LIST_CLASS, GroupContentMaterials, GroupContext, ManageContent } from "@/pages/Group";
import { ProfileImage } from "@/components/ProfileImage/ProfileImage";
import { type OptionInMenu, renderOption, hasAvailableOption } from "@/utils/dropdownMenuUtils"

import type { Folder } from "@/types/Capacity";
import "./GroupContents.less";
import { Filter } from "@/components/Filter/Filter";
import { ActionButton } from "@/components/ActionButton/ActionButton";
import { AuthContext } from "@/contexts/Auth";
import { UniversiModal } from "@/components/UniversiModal";
import Select, { MultiValue } from "react-select"

function SelectPeople(){

    const [selectedPeople, setSelectedPeople] = useState<{value: string, label: string}[] | null>(null)
    const groupContext = useContext(GroupContext)

    function makeRequest(){
        if(groupContext?.assignFolder == undefined || selectedPeople == undefined)
            return;
        UniversimeApi.Capacity.assignContent({folderId: groupContext?.assignFolder?.id, profilesIds: selectedPeople?.map((p)=>(p.value))})
        .then(res => {
            groupContext.setAssignFolder(undefined);
            groupContext.refreshData();
        })
    }

    function handleAssignChange(option : MultiValue<{value : string, label : string}>){
        setSelectedPeople(option.map(({value, label}) => ({value, label})));
    }

    return(
        <UniversiModal>
            <div id="universi-form-container">
                <div className="universi-form-container fields">

                    <div className="header">
                        <img src="/assets/imgs/create-content.png" />
                        <h1 className="title">Atribuir Conteúdo </h1>
                    </div>

                    <fieldset>
                        <legend>Pessoas</legend>
                        <Select
                            isMulti
                            name="pessoas"
                            options={groupContext?.participants.map((t)=>({value: t.id, label: t.firstname+" "+t.lastname}))}
                            className="category-select"
                            value={selectedPeople}
                            onChange={(option)=>{handleAssignChange(option)}}
                        />
                    </fieldset>
                    <section className="operation-buttons">
                        <button type="button" className="submit-button"
                        style={{width: "auto", padding: "0.75rem"}}
                        onClick={()=>{
                            setSelectedPeople(groupContext?.participants.map((p)=>({value: p.id, label: p.firstname+" "+p.lastname})) ?? null)
                        }}>
                            Todas as pessoas do grupo
                        </button>
                    </section>

                    <section className="operation-buttons">
                        <button type="button" className="cancel-button" onClick={() => groupContext?.setAssignFolder(undefined)}>
                            <i className="bi bi-x-circle-fill" />
                            Cancelar
                        </button>
                        <button type="button" className="submit-button" onClick={makeRequest} disabled={selectedPeople==undefined} title={selectedPeople==undefined ? undefined : "Preencha os dados antes de salvar"}>
                            <i className="bi bi-check-circle-fill" />
                            Salvar
                        </button>
                    </section>
                </div>
            </div>
        </UniversiModal>
    )
}

export function GroupContents() {
    const groupContext = useContext(GroupContext);
    const authContext = useContext(AuthContext);
    const [filterContents, setFilterContents] = useState<string>("");

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
            text: "Excluir",
            biIcon: "trash-fill",
            className: "delete",
            onSelect: handleDeleteContent,
            hidden() {
                return !groupContext?.group.canEdit;
            },
        }
    ]

    return (
        <section id="contents" className="group-tab">
            <div className="heading top-container">
                <div className="go-right">
                    <Filter setter={setFilterContents} placeholderMessage={`Buscar em Conteúdos ${groupContext.group.name}`}/>
                    {  
                        groupContext.group.canEdit &&
                        <ActionButton name="Criar conteúdo" buttonProps={{
                            onClick(){ groupContext.setEditContent(null); }
                        }} />
                    }
                </div>
            </div>

            <div className="content-list tab-list"> { makeContentList(groupContext.folders, filterContents) } </div>

            <ManageContent />
            {
                groupContext.assignFolder !== undefined
                ?
                <SelectPeople/>
                :
                <></>
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

            text: "Tem certeza que deseja excluir este conteúdo?",
            icon: "warning",
        }).then(res => {
            if (res.isConfirmed) {
                UniversimeApi.Capacity.removeFolder({id: content.id})
                    .then(res => {
                        if (!res.success)
                            return;

                        groupContext?.refreshData();
                    });
            }
        });
    }
}
