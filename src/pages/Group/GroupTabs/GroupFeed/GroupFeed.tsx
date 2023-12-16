import { ActionButton } from "@/components/ActionButton/ActionButton";
import { Filter } from "@/components/Filter/Filter";
import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";
import { RequiredValidation } from "@/components/UniversiForm/Validation/RequiredValidation";
import { TextValidation } from "@/components/UniversiForm/Validation/TextValidation";
import { ValidationComposite } from "@/components/UniversiForm/Validation/ValidationComposite";
import UniversimeApi from "@/services/UniversimeApi";
import { GroupPost } from "@/types/Feed";
import { ProfileClass } from "@/types/Profile";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GroupContext } from "../../GroupContext";
import "./GroupFeed.less";

export function GroupFeed(){

    const [filterPosts, setFilterPosts] = useState<string>("");
    const groupContext = useContext(GroupContext);


    if(groupContext == null)
        return <></>

    return(
        <section id="feed" className="group-tab">
            <div className="heading top-container">
                <div className="go-right">
                    <Filter setter={setFilterPosts} placeholderMessage={`Buscar publicação em ${groupContext.group.name}`}/>
                    {
                        groupContext.participants.some(p => p.id == groupContext.loggedData.profile.id)
                        ?
                            <ActionButton name="Criar publicação" buttonProps={{onClick(){groupContext.setEditPost(null)}}}/>
                        :
                            <></>
                    }
                </div>
            </div>

            <div className="feed-list tab-list"> 
            { 
                groupContext.posts.slice().reverse().map(renderPost)
            } 
            </div>
            {
                groupContext.editPost !== undefined ?

                <UniversiForm
                    formTitle={groupContext.editGroup == null ? "Criar publicação" : "Editar publicação"}
                    objects={[
                        {
                            DTOName: "groupId", label: "", type: FormInputs.HIDDEN, value: groupContext.group.id
                        }, {
                            DTOName: "authorId", label: "", type: FormInputs.HIDDEN, value: groupContext.loggedData.profile.id
                        }, {
                            DTOName: "content", label: "Publicação", type: FormInputs.LONG_TEXT, validation: new ValidationComposite<string>().addValidation(new RequiredValidation()).addValidation(new TextValidation())
                        }
                    ]}
                    requisition={groupContext.editPost ? UniversimeApi.Feed.createGroupPost : UniversimeApi.Feed.createGroupPost}
                    callback={() =>{groupContext.refreshData()}}
                />
                :
                <></>
            }
        </section>
    )

    function renderPost(post : GroupPost){

        if(filterPosts != "" && 
        !post.content.toLowerCase().includes(filterPosts.toLowerCase()))
            return <></>
        
        if(!post.author)
            return <></>

        const author : ProfileClass = new ProfileClass(post.author);


        return(
            <div className="feed-item tab-item">
                {
                    author
                    ?
                        <Link to={`/profile/${author?.user.name}`}>
                            <img className="feed-image" src={author.imageUrl} />
                        </Link>
                    : <></>
                }

                <div className="info">
                    <p className="group-description">{post.content}</p>
                </div>
            </div>
        )
    }
}