import { useContext, useMemo, useState } from "react";

import { ProfileContext } from "@/pages/Profile";
import { groupArray, removeFalsy } from "@/utils/arrayUtils";
import { contentImageUrl } from "@/utils/apiUtils";

import { type Folder, type FolderProfile } from "@/types/Capacity";
import { ProfileClass } from "@/types/Profile";

import "./ProfileAssignedByMe.less";
import { Filter } from "@/components/Filter/Filter";

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

    if (!context) return undefined;

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
        <img src={contentImageUrl(folder)} alt="" className="folder-image" />
        <div className="folder-data">
            <h2 className="folder-name">{folder.name}</h2>
            { fp.map(w => {
                const percentage = w.doneUntilNow / w.folderSize * 100;
                const shownPercentage = isNaN(percentage) ? 0 : percentage;

                return <div className="profile-watcher">
                    <img src={w.profile.imageUrl} className="profile-image" alt="" />

                    <div className="progress-data">
                        <h3 className="profile-name">{w.profile.fullname}</h3>

                        <div className="profile-progress">
                            <div className="progress-bar-container">
                                <div className="progress-until-now" style={{width: `${shownPercentage}%`}} />
                            </div>
                            <div className="text-progress">{ w.doneUntilNow } / { w.folderSize } ({shownPercentage}%)</div>
                        </div>
                    </div>

                </div>
            }) }
        </div>
    </div>
}
