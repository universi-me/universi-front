import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { EMPTY_LIST_CLASS, GroupContentMaterials, GroupContext } from "@/pages/Group";
import { setStateAsValue } from "@/utils/tsxUtils";
import { ProfileImage } from "@/components/ProfileImage/ProfileImage";

import type { Folder } from "@/types/Capacity";
import "./GroupContents.less";
import { Filter } from "@/components/Filter/Filter";

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
                <div className="go-right">
                    <Filter setter={setFilterContents} placeholderMessage={`Buscar em Conteúdos ${groupContext.group.name}`}/>
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
        const linkToFolder = `/capacitacao/folder/${content.id}`;

        const imageUrl = content.image?.startsWith("/")
            ? `${import.meta.env.VITE_UNIVERSIME_API}${content.image}`
            : content.image;

        return (
            <div className="content-item" key={content.id}>
                {/* <Link to={linkToFolder}> */}
                    <ProfileImage imageUrl={imageUrl} className="content-image" onClick={() => groupContext?.setCurrentContent(content)} />
                {/* </Link> */}

                <div className="info">
                    {/* <Link to={linkToFolder} className="content-name">{content.name}</Link> */}
                    <h2 className="content-name" onClick={() => groupContext?.setCurrentContent(content)}>{content.name}</h2>
                    <p className="content-description">{content.description}</p>
                </div>
            </div>
        );
    }
}
