import { ActionButton } from "@/components/ActionButton/ActionButton";
import { Filter } from "@/components/Filter/Filter";
import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";
import { RequiredValidation } from "@/components/UniversiForm/Validation/RequiredValidation";
import { TextValidation } from "@/components/UniversiForm/Validation/TextValidation";
import { ValidationComposite } from "@/components/UniversiForm/Validation/ValidationComposite";
import UniversimeApi from "@/services/UniversimeApi";
import { GroupPost } from "@/types/Feed";
import { ProfileClass } from "@/types/Profile";
import { hasAvailableOption, OptionInMenu, renderOption } from "@/utils/dropdownMenuUtils";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GroupContext } from "../../GroupContext";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import "./GroupFeed.less";

export function GroupFeed(){

    const [filterPosts, setFilterPosts] = useState<string>("");
    const groupContext = useContext(GroupContext);

    if(!groupContext)
        return null;

    const OPTIONS_DEFINITION: OptionInMenu<GroupPost>[] = [
        {
            text: "Editar publicação",
            biIcon: "pencil-fill",
            onSelect(data) {
                groupContext.setEditPost(data);
            },
            hidden(){
                return false;
            },
        },
        {
            text: "Excluir publicação",
            biIcon: "trash-fill",
            className: "delete",
            onSelect: handleDeletePost,
            hidden() {
                return !groupContext?.group.canEdit;
            },
        }
    ]

    function handleDeletePost(post: GroupPost){
        UniversimeApi.Feed.deleteGroupPost({postId: post.postId, groupId: post.groupId});
        groupContext?.refreshData();
    }

    function canCreatePost(){
        if(groupContext?.group.everyoneCanPost && groupContext.participants.some(p => p.id == groupContext.loggedData.profile.id))
            return true;
        else if(!groupContext?.group.everyoneCanPost && groupContext?.group.canEdit)
            return true;
        return false;
    }

    function canSeeMenu(post : GroupPost){
        if(groupContext?.loggedData.profile.id != groupContext?.group.admin.id && groupContext?.loggedData.profile.id != post.author?.id)
            return false;
        return true;
    }



    if(groupContext == null)
        return <></>

    return(
        <section id="feed" className="group-tab">
            <div className="heading top-container">
                <div className="go-right">
                    <Filter setter={setFilterPosts} placeholderMessage={`Buscar publicação em ${groupContext.group.name}`}/>
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
                            DTOName: "content", label: "Publicação", type: FormInputs.LONG_TEXT,
                            charLimit: 3000,
                            value: groupContext.editPost ? groupContext.editPost.content : ""
                            ,validation: new ValidationComposite<string>().addValidation(new RequiredValidation()).addValidation(new TextValidation())
                        }, {
                            DTOName : "postId", label : "", type : FormInputs.HIDDEN, value : groupContext.editPost?.postId
                        }
                    ]}
                    requisition={groupContext.editPost ? UniversimeApi.Feed.editGroupPost : UniversimeApi.Feed.createGroupPost}
                    callback={() => {groupContext.refreshData()}}
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
                    <>
                        <Link to={`/profile/${author?.user.name}`} className="feed-user-info">
                            <img className="feed-image" src={author.imageUrl} />
                            <p>{post.author.firstname} {post.author.lastname}</p>
                        </Link>
                        { !hasAvailableOption(OPTIONS_DEFINITION) || !canSeeMenu(post) ? null :
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger asChild>
                                    <button className="options-button">
                                        <i className="bi bi-three-dots-vertical" />
                                    </button>
                                </DropdownMenu.Trigger>

                                <DropdownMenu.Content className="options" side="left">
                                    { OPTIONS_DEFINITION.map(def => {
                                        if(def.text == "Editar publicação" && post.author?.id == groupContext?.loggedData.profile.id)
                                            return renderOption(post, def)
                                        else if(def.text == "Editar publicação")
                                            return null
                                        else
                                            return renderOption(post, def)

                                    }) }
                                    <DropdownMenu.Arrow className="options-arrow" height=".5rem" width="1rem" />
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        }
                    </>
                    : <></>
                }

                <div className="info">
                    <p className="feed-description">{post.content}</p>
                        { !hasAvailableOption(OPTIONS_DEFINITION) || !canSeeMenu(post) ? null :
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger asChild>
                                    <button className="options-button">
                                        <i className="bi bi-three-dots-vertical" />
                                    </button>
                                </DropdownMenu.Trigger>

                                <DropdownMenu.Content className="options" side="left">
                                    { OPTIONS_DEFINITION.map(def => {
                                        if(def.text == "Editar publicação" && post.author?.id == groupContext?.loggedData.profile.id)
                                            return renderOption(post, def)
                                        else if(def.text == "Editar publicação")
                                            return null
                                        else
                                            return renderOption(post, def)

                                    }) }
                                    <DropdownMenu.Arrow className="options-arrow" height=".5rem" width="1rem" />
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        }
                </div>
            </div>
        )
    }
}
