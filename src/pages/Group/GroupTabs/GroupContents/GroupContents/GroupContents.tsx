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

export function GroupContents() {
    const groupContext = useContext(GroupContext);
    const authContext = useContext(AuthContext);
    const [filterContents, setFilterContents] = useState<string>("");
    const [assignContent, setAssignContent] = useState(false)

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
                groupContext.setCurrentContent(data);
                setAssignContent(true);
            },
            hidden() {
                return !groupContext?.group.canEdit;
            }
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
                assignContent 
                ?
                    <></>
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

    function renderContent(content: Folder) {
        const imageUrl = content.image?.startsWith("/")
            ? `${import.meta.env.VITE_UNIVERSIME_API}${content.image}`
            : content.image;

        return (
            <div className="content-item tab-item" key={content.id}>
                {
                    imageUrl
                    ?
                    <ProfileImage imageUrl={imageUrl} className="content-image" onClick={() => groupContext?.setCurrentContent(content)} />
                    :
                    <ProfileImage imageUrl={"/assets/imgs/default-content.png"} className="content-image default-image" onClick={() => groupContext?.setCurrentContent(content)} />
                }

                <div className="info">
                    <div className="content-name-wrapper">
                        <h2 className="content-name" onClick={() => groupContext?.setCurrentContent(content)}>{content.name}</h2>

                        { !hasAvailableOption(OPTIONS_DEFINITION) ? null :
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
