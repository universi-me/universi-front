import { ActionButton } from "@/components/ActionButton/ActionButton";
import { Filter } from "@/components/Filter/Filter";
import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";
import { RequiredValidation } from "@/components/UniversiForm/Validation/RequiredValidation";
import { TextValidation } from "@/components/UniversiForm/Validation/TextValidation";
import { ValidationComposite } from "@/components/UniversiForm/Validation/ValidationComposite";
import UniversimeApi from "@/services/UniversimeApi";
import { useContext, useState } from "react";
import { GroupContext, GroupFeedPost } from "@/pages/Group";
import "./GroupFeed.less";

export function GroupFeed(){

    const [filterPosts, setFilterPosts] = useState<string>("");
    const groupContext = useContext(GroupContext);

    if(!groupContext)
        return null;

    function canCreatePost(){
        if (!groupContext)
            return false;

        if (groupContext.group.canEdit)
            return true;

        if (groupContext.group.everyoneCanPost)
            // return is participant
            return groupContext.participants.some(p => p.id === groupContext.loggedData.profile.id);

        return false;
    }

    if(groupContext == null)
        return <></>

    return(
        <section id="feed" className="group-tab">
            <div className="heading top-container">
                <div className="go-right">
                    <Filter setter={setFilterPosts} placeholderMessage={`Buscar posts em ${groupContext.group.name}`}/>
                    {
                        canCreatePost()
                        ?
                            <ActionButton name="Criar publicação" buttonProps={{onClick(){groupContext.setEditPost(null)}}}/>
                        :
                            <></>
                    }
                </div>
            </div>

            <div className="feed-list tab-list"> 
            { 
                groupContext.posts
                    .slice()
                    .reverse()
                    .filter(p => p.content.toLocaleLowerCase().includes(filterPosts.toLocaleLowerCase()))
                    .map(p => <GroupFeedPost post={p} key={p.postId}/>)
            } 
            </div>
            {
                groupContext.editPost !== undefined ?

                <UniversiForm
                    formTitle={groupContext.editGroup == null ? "Criar post" : "Editar grupo"}
                    objects={[
                        {
                            DTOName: "groupId", label: "", type: FormInputs.HIDDEN, value: groupContext.group.id
                        }, {
                            DTOName: "authorId", label: "", type: FormInputs.HIDDEN, value: groupContext.loggedData.profile.id
                        }, {
                            DTOName: "content", label: "Mensagem do post", type: FormInputs.LONG_TEXT,
                            charLimit: 3000,
                            value: groupContext.editPost ? groupContext.editPost.content : ""
                            ,validation: new ValidationComposite<string>().addValidation(new RequiredValidation()).addValidation(new TextValidation())
                        }, {
                            DTOName : "postId", label : "", type : FormInputs.HIDDEN, value : groupContext.editPost?.postId
                        }
                    ]}
                    requisition={groupContext.editPost ? UniversimeApi.Feed.editGroupPost : UniversimeApi.Feed.createGroupPost}
                    callback={groupContext.refreshData}
                />
                :
                <></>
            }
        </section>
    )
}