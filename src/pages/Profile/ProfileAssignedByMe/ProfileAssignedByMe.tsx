import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { ProfileContext } from "@/pages/Profile";
import { Filter } from "@/components/Filter/Filter";
import { groupArray } from "@/utils/arrayUtils";
import { contentImageUrl } from "@/utils/apiUtils";

import { type Folder, type FolderProfile } from "@/types/Capacity";
import { ProfileClass } from "@/types/Profile";

import "./ProfileAssignedByMe.less";

export function ProfileAssignedByMe() {
    const context = useContext(ProfileContext);
    const [filter, setFilter] = useState<string>("");
    const groupedFolders = useMemo(() => {
        if (!context) return new Map();

        return groupArray(
            [...context.profileListData.assignedByMe]
                .map(fp => ({...fp, profile: new ProfileClass(fp.profile)}))
                .sort((a, b) => {
                    if (a.folder.reference === b.folder.reference)
                        return (a.profile.fullname ?? "").localeCompare(b.profile.fullname ?? "")
                    else
                        return a.folder.name.localeCompare(b.folder.name);
                })
                .filter(fp => {
                    const filterLow = filter.toLocaleLowerCase();
                    const folderLow = fp.folder.name.toLocaleLowerCase();
                    const profileLow = fp.profile.fullname?.toLocaleLowerCase() ?? "";

                    return folderLow.includes(filterLow) || profileLow.includes(filterLow)
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
            <Filter placeholderMessage="Filtrar atribuições" setter={setFilter} />
        </div>
        <div id="assigned-by-me-wrapper">
        {
            Array.from(groupedFolders.entries()).map(([reference, assignments]) => {
                const folder = assignments.length > 0
                    ? assignments[0].folder
                    : null;

                return folder &&
                    <WatchFolderProgress fp={assignments} folder={folder} key={reference} />
            })
        }
        </div>
    </div>;
}

type WatchFolderProgressProps = {
    fp: (FolderProfile & {profile: ProfileClass})[];
    folder: Folder;
};

function WatchFolderProgress({fp, folder}: Readonly<WatchFolderProgressProps>) {
    if (fp.length === 0) return null;

    return <div className="folder-profile-item">
        <Link to={`/content/${folder.reference}`} target="_blank" className="folder-name">
            <img src={contentImageUrl(folder)} alt="" className="folder-image" />
        </Link>
        <div className="folder-data">
            <Link to={`/content/${folder.reference}`} target="_blank" className="folder-name">{folder.name}</Link>
            { fp.map(w => {
                const percentage = w.doneUntilNow / w.folderSize * 100;
                const shownPercentage = isNaN(percentage) ? 0 : percentage;

                return <Link to={`/content/${folder.reference}?watch=${w.profile.user.name}`} target="_blank" className="profile-watcher" key={w.id}>
                    <img src={w.profile.imageUrl} className="profile-image" alt="" />

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
}
