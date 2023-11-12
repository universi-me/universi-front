import { ReactNode, useContext, useState } from "react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import UniversimeApi from "@/services/UniversimeApi";
import * as SwalUtils from "@/utils/sweetalertUtils";
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

    const OPTIONS_DEFINITION: OptionInMenu[] = [
        {
            text: "Editar",
            biIcon: "pencil-fill",
            disabled() { return true; },
            hidden() {
                return groupContext?.group.admin.id !== groupContext?.loggedData.profile.id;
            },
        },
        {
            text: "Excluir",
            biIcon: "trash-fill",
            className: "delete",
            onSelect: handleDeleteContent,
            hidden() {
                return groupContext?.group.admin.id !== groupContext?.loggedData.profile.id;
            },
        }
    ]

    const hasAvailableOption = undefined !== OPTIONS_DEFINITION.find(def => !def.hidden && !def.disabled);

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

                        { !hasAvailableOption ? null :
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

    function renderOption(content: Folder, option: OptionInMenu) {
        if (option.hidden)
            return null;

        const className = "content-options-item" + (option.className ? ` ${option.className}` : "");
        const disabled = option.disabled ? option.disabled() : undefined;
        const onSelect = disabled ? undefined : makeOnSelect(content, option.onSelect);    
        const key = option.text?.toString();

        return <DropdownMenu.Item {...{className, disabled, onSelect, key}}>
            { option.text }
            { option.biIcon ? <i className={`bi bi-${option.biIcon} right-slot`}/> : null }
        </DropdownMenu.Item>
    }

    function makeOnSelect(data: Folder, callback?: (data: Folder) => any) {
        return callback
            ? function() { callback(data); }
            : undefined;
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

type OptionInMenu = {
    text:       ReactNode;
    biIcon?:    string;
    className?: string;

    onSelect?: (data: Folder) => any;
    disabled?: () => boolean;
    hidden?:   () => boolean;
};
