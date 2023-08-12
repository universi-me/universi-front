import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UniversimeApi } from "@/hooks/UniversimeApi";
import { AuthContext } from "@/src/contexts/Auth/AuthContext";
import { GroupBanner, GroupIntro, GroupAbout, GroupSubGroups, GroupMembers, GroupContext, GroupContextType } from "@/pages/Group"
import "./Group.css"
import "./card.css"

export function GroupPage() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const { id: nickname } = useParams();

    const [groupContext, setGroupContext] = useState<GroupContextType>(null);

    if (auth.user === null) {
        navigate('/login');
    }

    useEffect(() => { loadAccessedGroup() }, [])

    return (
        !groupContext ? null :

        <GroupContext.Provider value={groupContext}>
        <div id="group-page">
            {/* todo: get banner content from API */}
            <GroupBanner bannerContent={"#4E4E4E"} />
            <div className="content">
                {/* todo: group intro content from API */}
                <GroupIntro verified={true}/>
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

                    <div className="right-side">
                        {/* todo: group members from API */}
                        <GroupMembers
                            members={["", "", "", "", "", ""]}
                            count={0}
                        />
                    </div>
                </div>
            </div>
        </div>
        </GroupContext.Provider>
    );

    async function loadAccessedGroup() {
        const groupRes = await UniversimeApi.Group.get(undefined, nickname);

        setGroupContext({
            group: groupRes.body.group,
        });
    }
}
