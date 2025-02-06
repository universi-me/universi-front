import { ChangeEvent, useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { ProfileContext } from "@/pages/Profile";
import { Filter } from "@/components/Filter/Filter";
import { groupArray } from "@/utils/arrayUtils";
import { contentImageUrl } from "@/utils/apiUtils";
import { makeClassName } from "@/utils/tsxUtils";
import stringUtils from "@/utils/stringUtils";

import { ProfileClass } from "@/types/Profile";

import "./ProfileAssignedByMe.less";
import { ProfileImage } from "@/components/ProfileImage/ProfileImage";

export function ProfileAssignedByMe() {
    const context = useContext(ProfileContext);
    const [filter, setFilter] = useState<string>("");
    const [completionFilter, setCompletionFilter] = useState<CompletionFilter>(() => (() => true));

    const groupedFolders: Map<string, FolderProfileClass[]> = useMemo(() => {
        if (!context) return new Map();

        return groupArray(
            [...context.profileListData.assignedByMe]
                .map(fp => ({...fp, profile: new ProfileClass(fp.assignedTo)}))
                .sort((a, b) => {
                    if (a.folder.reference === b.folder.reference)
                        return (a.profile.fullname ?? "").localeCompare(b.profile.fullname ?? "")
                    else
                        return a.folder.name.localeCompare(b.folder.name);
                })
                .filter(fp => {
                    return stringUtils.includesIgnoreCase(fp.folder.name, filter)
                        || stringUtils.includesIgnoreCase(fp.profile.fullname ?? "", filter);
                }),
            fp => fp.folder.reference,
        )
    }, [filter, context?.profile]);

    if (!context) return null;

    const tabTitle = context.profile.user.ownerOfSession
        ? "Suas atribuições"
        : `Atribuições de ${context.profile.fullname}`;

    return <div id="profile-assigned-by-me-tab">
        <div className="title-filter-wrapper">
            <h1 className="tab-title">{tabTitle}</h1>
            <div id="filters">
                <Filter placeholderMessage="Filtrar atribuições" setter={setFilter} />
                <div id="completion-filter">
                    <select name="completion-selector" id="completion-selector" defaultValue="all" onChange={changeCompletionFilter}>
                        <option value="all">Exibir todos</option>
                        <option value="complete">Exibir apenas completos</option>
                        <option value="incomplete">Exibir apenas incompletos</option>
                    </select>
                </div>
            </div>
        </div>
        <div id="assigned-by-me-wrapper">
        {
            Array.from(groupedFolders.entries()).map(([reference, assignments]) => {
                const folder = assignments.length > 0
                    ? assignments[0].folder
                    : null;

                return folder &&
                    <WatchFolderProgress fp={assignments} folder={folder} key={reference} completionFilter={completionFilter} />
            })
        }
        </div>
    </div>;

    function changeCompletionFilter(e: ChangeEvent<HTMLSelectElement>) {
        const setTo = e.currentTarget.value;
        let filter: CompletionFilter;

        if (setTo === "complete")
            filter = fp => fp.doneUntilNow === fp.folderSize;
        else if (setTo === "incomplete")
            filter = fp => fp.doneUntilNow < fp.folderSize;
        else
            filter = fp => true;

        setCompletionFilter(() => filter);
    }
}

type FolderProfileClass = FolderProfile & { profile: ProfileClass };
type CompletionFilter = (fp: FolderProfileClass) => boolean;

type WatchFolderProgressProps = {
    fp: FolderProfileClass[];
    folder: Folder;
    completionFilter: CompletionFilter;
};

function WatchFolderProgress(props: Readonly<WatchFolderProgressProps>) {
    const {fp, folder, completionFilter} = props;

    const [isExpanded, setIsExpanded] = useState(false);

    const filteredFp = fp.filter(completionFilter);
    if (filteredFp.length === 0) return null;

    const profilesComplete = fp
        .filter(fp => fp.doneUntilNow === fp.folderSize);

    const assignCompletePercentage = profilesComplete.length / fp.length * 100;

    const folderShownPercentage = isNaN(assignCompletePercentage) ? 0 : assignCompletePercentage;

    const textFolderPercent = folderShownPercentage.toLocaleString('pt-BR', {
        maximumFractionDigits: 1,
    });

    return <div className="folder-profile-item">
        <Link to={`/content/${folder.reference}`} target="_blank">
            <img src={contentImageUrl(folder)} alt="" className="folder-image" />
        </Link>

        <div className="folder-data">
            <Link to={`/content/${folder.reference}`} target="_blank" className="folder-name">{folder.name}</Link>
            <div className="folder-bar-wrapper">
                <div className="folder-progress-bar-container">
                    <div className="folder-progress-until-now" style={{width: `${folderShownPercentage}%`}} />
                </div>
                {profilesComplete.length} / {fp.length} pessoas ({textFolderPercent}%) completaram o conteúdo
            </div>

            <div className={makeClassName("profile-watcher-wrapper", isExpanded ? "expanded" : "collapsed")}>
            { filteredFp.map(w => {
                const percentage = w.doneUntilNow / w.folderSize * 100;
                const shownPercentage = isNaN(percentage) ? 0 : percentage;

                return <Link to={`/content/${folder.reference}?watch=${w.profile.user.name}`} target="_blank" className="profile-watcher" key={w.id}>
                    <ProfileImage className="profile-image" imageUrl={w.profile.imageUrl!} name={w.profile?.fullname} />

                    <div className="progress-data">
                        <h3 className="profile-name">{w.profile.fullname}</h3>

                        <div className="profile-progress">
                            <div className="progress-bar-container">
                                <div className="progress-until-now" style={{width: `${shownPercentage}%`}} />
                            </div>
                            <div className="text-progress">{ w.doneUntilNow } / { w.folderSize } ({
                                shownPercentage.toLocaleString(undefined, { maximumFractionDigits: 2 })
                            }%)</div>
                        </div>
                    </div>
                </Link>
            }) }
            </div>
        </div>

        <button onClick={toggleExpand} className={makeClassName("expand-button", isExpanded ? "expanded": "collapsed")}>
            <span className="bi bi-chevron-down" />
        </button>
    </div>

    function toggleExpand() {
        setIsExpanded(exp => !exp)
    }
}
