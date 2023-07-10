import { useParams } from "react-router-dom";

import { GroupBanner, GroupIntro } from "@/pages/Group"
import "./Group.css"

export function GroupPage() {
    const { id } = useParams();
    // todo: Get group info from API

    return (
        <div id="group-page">
            {/* todo: get banner content from API */}
            <GroupBanner bannerContent={"#4E4E4E"} />
            <div className="content">
                <GroupIntro
                    imageUrl="#D9D9D9"
                    name="Nome do grupo"
                    type="Tipo"
                    verified={true}
                />
            </div>
        </div>
    );
}
