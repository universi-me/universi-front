import { useContext, useState } from "react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { EMPTY_LIST_CLASS, GroupContentMaterials, GroupContext } from "@/pages/Group";
import { setStateAsValue } from "@/utils/tsxUtils";
import { ProfileImage } from "@/components/ProfileImage/ProfileImage";

import type { Folder } from "@/types/Capacity";
import "./GroupContents.less";

export function GroupContents() {
    const groupContext = useContext(GroupContext);
    const [filterContents, setFilterContents] = useState<string>("");

    if (!groupContext)
        return null;

    if (groupContext.currentContent) {
        return <GroupContentMaterials />;
    }

    return (
        <section id="contents" className="group-tab">
            <div className="heading top-container">
                <div className="title-container">
                    <i className="bi bi-list-ul tab-icon"/>
                    <h2 className="title">Conteúdos {groupContext.group.name}</h2>
                </div>
                <div className="go-right">
                    <div id="filter-wrapper">
                        <i className="bi bi-search filter-icon"/>
                        <input type="search" name="filter-contents" id="filter-contents" className="filter-input"
                            onChange={setStateAsValue(setFilterContents)} placeholder={`Buscar em Conteúdos ${groupContext.group.name}`}
                        />
                    </div>
                </div>
            </div>

            <div className="content-list"> { makeContentList(groupContext.folders, filterContents) } </div>
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

        return filteredContents
            .map(renderContent);
    }

    function renderContent(content: Folder) {
        const imageUrl = content.image?.startsWith("/")
            ? `${import.meta.env.VITE_UNIVERSIME_API}${content.image}`
            : content.image;

        return (
            <div className="content-item" key={content.id}>
                <ProfileImage imageUrl={imageUrl} className="content-image" onClick={() => groupContext?.setCurrentContent(content)} />

                <div className="info">
                    <div className="content-name-wrapper">
                        <h2 className="content-name" onClick={() => groupContext?.setCurrentContent(content)}>{content.name}</h2>
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <button className="content-options-button">
                                    <i className="bi bi-three-dots-vertical" />
                                </button>
                            </DropdownMenu.Trigger>

                            <DropdownMenu.Content className="content-options" side="left">
                                <DropdownMenu.Item className="content-options-item" disabled>
                                    Editar <i className="bi bi-pencil-fill right-slot" />
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="content-options-item delete">
                                    Excluir <i className="bi bi-trash-fill right-slot" />
                                </DropdownMenu.Item>

                                <DropdownMenu.Arrow className="content-options-arrow" height=".5rem" width="1rem" />
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </div>
                    <p className="content-description">{content.description}</p>
                </div>
            </div>
        );
    }
}
