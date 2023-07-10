import { useParams } from "react-router-dom";

import { GroupBanner } from "@/pages/Group"

export function GroupPage() {
    const { id } = useParams();
    // todo: Get group info from API

    return (
        <div id="group-page">
            {/* todo: get banner content from API */}
            <GroupBanner bannerContent={"#4E4E4E"} />
        </div>
    );
}
