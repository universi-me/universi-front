import { useContext, useMemo, useState } from "react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { UniversimeApi } from "@/services"
import * as SwalUtils from "@/utils/sweetalertUtils";
import { EMPTY_LIST_CLASS, GroupContentMaterials, GroupContext } from "@/pages/Group";
import { ManageContent } from "@/components/ManageContent";
import { type OptionInMenu, renderOption, hasAvailableOption } from "@/utils/dropdownMenuUtils";
import AssignFolderForm from "./AssignFolderForm";

import "./GroupContents.less";
import { Filter } from "@/components/Filter/Filter";
import { ActionButton } from "@/components/ActionButton/ActionButton";
import UniversiForm from "@/components/UniversiForm";
import useCanI from "@/hooks/useCanI";
import { Permission } from "@/utils/roles/rolesUtils";


export function GroupContents() {
    const groupContext = useContext(GroupContext);
    const [filterContents, setFilterContents] = useState<string>("");
    const [importContentAvailable, setImportContentAvailable] = useState<Capacity.Folder.DTO[]>();
    const [duplicateContentId, setDuplicateContentId] = useState<string | undefined> ();
    const [moveContentReference, setMoveContentReference] = useState<string>();

    const canI = useCanI();

    if (!groupContext)
        return null;

    if (groupContext.currentContent) {
        return <GroupContentMaterials />;
    }

    const OPTIONS_DEFINITION: OptionInMenu<Capacity.Folder.DTO>[] = [
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
                UniversimeApi.Capacity.Folder.favorite( data.id )
                .then(res => {res.isSuccess() && groupContext.refreshData()});
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
                UniversimeApi.Capacity.Folder.unfavorite( data.id )
                .then(res => {res.isSuccess() && groupContext.refreshData()});
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
        },
        {
            text: "Mover conteúdo",
            biIcon: "folder-symlink-fill",
            onSelect(data) {
                setMoveContentReference(data.reference);
            },
            hidden(data) {
                return !canI("CONTENT", Permission.READ_WRITE_DELETE, groupContext.group);
            }
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
                <ManageContent content={groupContext.editContent} group={groupContext.group} afterSave={ async res => {
                    let newContext = groupContext;
                    if ( res?.isSuccess() )
                        newContext = await groupContext.refreshData();

                    newContext.setEditContent( undefined );
                } } />
            }
            {
                groupContext.assignFolder !== undefined
                ?
                <AssignFolderForm/>
                :
                duplicateContentId !== undefined
                ?
                <UniversiForm.Root title="Criar uma cópia" callback={ handleDuplicate } confirmButtonText="Copiar">
                    <UniversiForm.Input.Select
                        param="targetGroup"
                        label="Copiar para:"
                        options={ groupContext.loggedData.groups.filter( g => g.canEdit ) }
                        getOptionUniqueValue={ g => g.id! }
                        getOptionLabel={ g => g.name }
                        required
                    />
                </UniversiForm.Root>
                : moveContentReference !== undefined ? <UniversiForm.Root title="Mover conteúdo" callback={ handleMove } confirmButtonText="Mover">
                    <UniversiForm.Input.Select
                        param="targetGroup"
                        label="Mover para:"
                        options={ groupContext.loggedData.groups.filter( g => g.id !== groupContext.group.id && canI("GROUP", Permission.READ_WRITE, g ) ) }
                        getOptionUniqueValue={ g => g.id! }
                        getOptionLabel={ g => g.name }
                        required
                    />
                </UniversiForm.Root>
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


    function makeContentList(contents: Capacity.Folder.DTO[], filter: string) {
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

    function selectContent(content: Capacity.Folder.DTO) {
        groupContext?.setCurrentContent(content)
        window.location.hash = "contents" + "/" + content.id;
    }

    function renderContent(content: Capacity.Folder.DTO) {
        const imageUrl = content.image?.startsWith("/")
            ? `${import.meta.env.VITE_UNIVERSIME_API}${content.image}`
            : content.image;

        return (
            <div className="content-item tab-item" key={content.id}>
                {
                    imageUrl
                    ?
                    <img src={imageUrl} title={content.name} className="content-image" onClick={() => selectContent(content)} />
                    :
                    <img src={"/assets/imgs/default-content.png"} title={content.name} className="content-image default-image" onClick={() => selectContent(content)} />
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

    function handleDeleteContent(content: Capacity.Folder.DTO) {
        SwalUtils.fireModal({
            showCancelButton: true,

            cancelButtonText: "Cancelar",
            confirmButtonText: "Excluir",
            confirmButtonColor: "var(--font-color-alert)",

            text: "Tem certeza que deseja remover este conteúdo do grupo?",

            icon: "warning",
        }).then(res => {
            if (res.isConfirmed) {
                UniversimeApi.Capacity.Folder.update(content.id, { removeGrantedAccessGroups: [ groupContext!.group.id! ] })
                    .then(res => {
                        if (!res.isSuccess())
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
            UniversimeApi.Capacity.Folder.list()
            .then(res => {
                if (res.isSuccess()) setImportContentAvailable(res.data);
            })
        }
    }

    async function handleDuplicate( form: UniversiForm.Data<{ targetGroup: Group.DTO }> ) {
        if ( !form.confirmed ) {
            setDuplicateContentId( undefined );
            return;
        }

        await UniversimeApi.Capacity.Folder.duplicate( duplicateContentId!, { groups: [ form.body.targetGroup.id! ] } );
        await groupContext?.refreshData();
        setDuplicateContentId( undefined );
    }

    async function handleMove( form: UniversiForm.Data<{ targetGroup: Group.DTO }> ) {
        if ( !form.confirmed ) {
            setMoveContentReference( undefined );
            return;
        }

        await UniversimeApi.Capacity.Folder.move( moveContentReference!, {
            originalGroupId: groupContext!.group.id!,
            newGroupId: form.body.targetGroup.id!,
        } );
        await groupContext!.refreshData();
        setMoveContentReference( undefined );
    }
}

type ImportContentProps = {
    availableContents: Capacity.Folder.DTO[];
    resetContents(): any;
};
function ImportContent(props: Readonly<ImportContentProps>) {
    const groupContext = useContext(GroupContext);
    const { availableContents, resetContents } = props;

    const importOptions = useMemo(() => {
        return availableContents
            // filter - not already in group
            .filter(c => !groupContext?.folders.find(groupContent => groupContent.id === c.id))

            .sort( ( c1, c2 ) => c1.name.localeCompare( c2.name ) );
    }, availableContents)

    return <UniversiForm.Root title="Importar Conteúdos" callback={ handleImport }>
        <UniversiForm.Input.Select
            param="contents"
            label="Conteúdos disponíveis"
            required
            isMultiSelection
            options={ importOptions }
            getOptionUniqueValue={ c => c.id }
            getOptionLabel={ c => c.name }
        />
    </UniversiForm.Root>

    async function handleImport( form: UniversiForm.Data<{ contents: Capacity.Folder.DTO[] }> ) {
        if ( !form.confirmed ) {
            await resetContents();
            return;
        }

        const contentIds = form.body.contents.map( c => c.id );

        await Promise.all(contentIds.map( cId => UniversimeApi.Capacity.Folder.update( cId, {
            addGrantedAccessGroups: [ groupContext!.group.id! ],
        })));

        await groupContext!.refreshData();
        await resetContents();
    }
}
