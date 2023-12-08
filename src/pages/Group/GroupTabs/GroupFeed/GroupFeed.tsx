import { ActionButton } from "@/components/ActionButton/ActionButton";
import { Filter } from "@/components/Filter/Filter";
import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";
import { RequiredValidation } from "@/components/UniversiForm/Validation/RequiredValidation";
import { TextValidation } from "@/components/UniversiForm/Validation/TextValidation";
import { ValidationComposite } from "@/components/UniversiForm/Validation/ValidationComposite";
import UniversimeApi from "@/services/UniversimeApi";
import { GroupPost } from "@/types/Feed";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GroupContext } from "../../GroupContext";

export function GroupFeed(){

    const [filterPosts, setFilterPosts] = useState<string>("");
    const groupContext = useContext(GroupContext);

    console.log(groupContext)

    if(groupContext == null)
        return <></>

    return(
        <section id="groups" className="group-tab">
            <div className="heading top-container">
                <div className="go-right">
                    <Filter setter={setFilterPosts} placeholderMessage={`Buscar posts em ${groupContext.group.name}`}/>
                    {
                        <ActionButton name="Novo Post" buttonProps={{onClick(){groupContext.setEditPost(null)}}}/>
                    }
                </div>
            </div>

            <div className="group-list tab-list"> 
            { 
                groupContext.posts.map(renderPost)
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
                            DTOName: "title", label: "Título do post", type: FormInputs.TEXT, validation: new ValidationComposite<string>().addValidation(new RequiredValidation()).addValidation(new TextValidation())
                        }, {
                            DTOName: "content", label: "Mensagem do post", type: FormInputs.LONG_TEXT, validation: new ValidationComposite<string>().addValidation(new RequiredValidation()).addValidation(new TextValidation())
                        }
                    ]}
                    requisition={groupContext.editPost ? UniversimeApi.Feed.createGroupPost : UniversimeApi.Feed.createGroupPost}
                    callback={()=>{groupContext.setEditGroup(undefined); groupContext.refreshData()}}
                />
                :
                <></>
            }
        </section>
    )

    // function makePostList(){
    //     if(groupContext?.group == undefined)
    //         return <></>
    //     UniversimeApi.Feed.getGroupPosts({groupId : groupContext?.group.id})
    //     .then((response)=>{
    //         if(response.success){
    //             setGroupPosts(response.body);
    //         }
    //     })

    //     return renderPost({content: "Testando uma postagem de um post no universi.me, teoricamente isso seria uma request da API",
    //                        title: "Teste de post",
    //                         author: groupContext.loggedData.profile})
    // }

    function renderPosts(posts: GroupPost[]){
        return(posts.map(renderPost))
    }

    function renderPost(post : GroupPost){
        // const linkToProfile = `/profile/${post.author.user}`
        console.log("renderPost")

        if(filterPosts != "" && 
        !post.content.toLowerCase().includes(filterPosts.toLowerCase()))
            return <></>


        return(
            <div className="group-item tab-item">
                <Link to={"/"}>
                    <img className="group-image" src={"/assets/imgs/default_avatar.png"} />
                </Link>

                <div className="info">
                    <p className="group-description">{post.content}</p>
                </div>
            </div>
        )
    }
}