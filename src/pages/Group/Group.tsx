import { useParams } from "react-router-dom";

import { GroupBanner, GroupIntro, GroupAbout, GroupSubGroups } from "@/pages/Group"
import "./Group.css"
import "./card.css"

export function GroupPage() {
    const { id } = useParams();
    // todo: Get group info from API

    return (
        <div id="group-page">
            {/* todo: get banner content from API */}
            <GroupBanner bannerContent={"#4E4E4E"} />
            <div className="content">
                {/* todo: group intro content from API */}
                <GroupIntro
                    imageUrl="#D9D9D9"
                    name="Nome do grupo"
                    type="Tipo"
                    verified={true}
                />
                <div className="group-infos">
                    <div className="left-side">
                        {/* todo: group about content from API */}
                        <GroupAbout
                            description={"Lorem ipsum dolor sit amet. Hic dolor reiciendis rem earum voluptatem sit similique magnam est repellat mollitia. Et nesciunt consequuntur a vero rerum aut optio tempore aut."}
                            creationDate={"00/00/0000"}
                        />
                        <button className="join-button">Participar</button>
                        {/* todo: subgroups from API */}
                        <GroupSubGroups
                            subgroups={["", ""]}
                            count={0}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
