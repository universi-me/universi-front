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
    console.dir(groupContext);

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
                        <GroupAbout />
                        <button className="join-button">Participar</button>
                        <GroupSubGroups />
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
        const [subgroupsRes] = await Promise.all([
            UniversimeApi.Group.subgroups(groupRes.body.group.id)
        ]);

        setGroupContext({
            group: groupRes.body.group,
            subgroups: subgroupsRes.body.subgroups,
        });
    }
}
