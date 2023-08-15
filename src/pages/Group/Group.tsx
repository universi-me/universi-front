import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UniversimeApi } from "@/hooks/UniversimeApi";
import { AuthContext } from "@/contexts/Auth";
import { GroupBanner, GroupIntro, GroupAbout, GroupSubGroups, GroupMembers, GroupContext, GroupContextType } from "@/pages/Group"
import "./Group.css"
import "./card.css"

export function GroupPage() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const groupPath = '/' + useParams()["*"];

    const [groupContext, setGroupContext] = useState<GroupContextType>(null);

    if (auth.user === null) {
        navigate('/login');
    }

    useEffect(() => { loadAccessedGroup() }, [groupPath])
    console.dir(groupContext);

    return (
        !groupContext ? null :

        <GroupContext.Provider value={groupContext}>
        <div id="group-page">
            {/* todo: get banner content from API */}
            <GroupBanner bannerContent={"#4E4E4E"} />
            <div className="content">
                <GroupIntro verified={true}/>
                <div className="group-infos">
                    <div className="left-side">
                        <GroupAbout />
                        <button onClick={ groupContext.isParticipant ? exitGroup : joinGroup } className="join-button">
                            { groupContext.isParticipant ? "Sair" : "Participar" }
                        </button>
                        <GroupSubGroups />
                    </div>

                    <div className="right-side">
                        <GroupMembers />
                    </div>
                </div>
            </div>
        </div>
        </GroupContext.Provider>
    );

    async function loadAccessedGroup() {
        const groupRes = await UniversimeApi.Group.get(undefined, groupPath);
        const [subgroupsRes, participantsRes] = await Promise.all([
            UniversimeApi.Group.subgroups(groupRes.body.group.id),
            UniversimeApi.Group.participants(groupRes.body.group.id),
        ]);

        setGroupContext({
            group: groupRes.body.group,
            subgroups: subgroupsRes.body.subgroups,
            participants: participantsRes.body.participants,
            isParticipant: participantsRes.body.participants.find(p => p.user.name === auth.user?.name) !== undefined,

            reloadPage: loadAccessedGroup,
        });
    }

    function joinGroup() {
        if (groupContext === null)
            return;

        UniversimeApi.Group.join(groupContext.group.id)
            .then(r => {
                console.dir(r);
                groupContext.reloadPage();
            });
    }

    function exitGroup() {
        if (groupContext === null)
            return;

        UniversimeApi.Group.exit(groupContext.group.id)
            .then(r => {
                console.dir(r);
                groupContext.reloadPage();
            });
    }
}
