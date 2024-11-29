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
import useCanI from "@/hooks/useCanI";
import { Permission } from "@/types/Roles";
import { GroupPostComment } from "@/types/Feed";

function isGroupPostComment(post: any): post is GroupPostComment {
    try {
        return 'id' in post;
    } catch {
        return false;
    }
}

export function GroupFeed(){

    const [filterPosts, setFilterPosts] = useState<string>("");
    const groupContext = useContext(GroupContext);
    const canI = useCanI();

    if(!groupContext)
        return null;

    function canCreatePost(){
        if (!groupContext)
            return false;

       return canI("FEED", Permission.READ_WRITE, groupContext.group);
    }

    if(groupContext == null)
        return <></>

    return(
        <section id="feed" className="group-tab">
            <div className="heading top-container">
                <div className="go-right">
                    <Filter setter={setFilterPosts} placeholderMessage={`Buscar publicação em ${groupContext.group.name}`}/>
                    {
                        canCreatePost() &&
                            <ActionButton name="Criar publicação" buttonProps={{onClick(){groupContext.setEditPost(null)}}}/>
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
                    formTitle={groupContext.editPost == null ? "Criar publicação" : isGroupPostComment(groupContext.editPost) ? "Editar comentário":"Editar publicação"}
                    cancelProps = {
                        {
                            title : isGroupPostComment(groupContext.editPost) ?"Descartar comentário?":"Descartar publicação?",
                            message: "Tem certeza? Esta ação é irreversível", 
                            confirmButtonMessage: "Sim",
                            cancelButtonMessage: "Não"
                        }

                    }
                    objects={[
                        {
                            DTOName: "groupId", label: "", type: FormInputs.HIDDEN, value: groupContext.group.id
                        }, {
                            DTOName: "authorId", label: "", type: FormInputs.HIDDEN, value: groupContext.loggedData.profile.id
                        }, {
                            DTOName: "content", label: isGroupPostComment(groupContext.editPost) ? "Comentário" :"Publicação", type: FormInputs.FORMATED_TEXT,
                            charLimit: isGroupPostComment(groupContext.editPost) ? 2000 : 3000,
                            value: groupContext.editPost ? groupContext.editPost.content : ""
                            ,validation: new ValidationComposite<string>().addValidation(new RequiredValidation()).addValidation(new TextValidation())
                        }, {
                            DTOName : "postId", label : "", type : FormInputs.HIDDEN, value : groupContext.editPost?.postId
                        }, {
                            DTOName : "commentId", label : "", type : FormInputs.HIDDEN, value : (groupContext.editPost as GroupPostComment)?.id
                        },
                    ]}
                    requisition={groupContext.editPost ? (isGroupPostComment(groupContext.editPost) ? UniversimeApi.Feed.editGroupPostComment : UniversimeApi.Feed.editGroupPost) : UniversimeApi.Feed.createGroupPost}
                    callback={async() => await groupContext.refreshData()}
                />
                :
                <></>
            }
        </section>
    )
}