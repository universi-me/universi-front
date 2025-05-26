import { ActionButton } from "@/components/ActionButton/ActionButton";
import { Filter } from "@/components/Filter/Filter";
import UniversiForm from "@/components/UniversiForm2";
import { UniversimeApi } from "@/services"
import { useContext, useState } from "react";
import { GroupContext, GroupFeedPost } from "@/pages/Group";
import "./GroupFeed.less";
import useCanI from "@/hooks/useCanI";
import { Permission } from "@/utils/roles/rolesUtils";
import { isGroupPostComment } from "@/types/Feed";

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

                <UniversiForm.Root
                    title={ groupContext.editPost == null ? "Criar publicação" : isGroupPostComment(groupContext.editPost) ? "Editar comentário":"Editar publicação" }
                    cancelButtonText={ isGroupPostComment(groupContext.editPost) ?"Descartar comentário?":"Descartar publicação?" }
                    callback={ handleForm }
                >
                    <UniversiForm.Input.FormattedText
                        param="content"
                        label={ isGroupPostComment(groupContext.editPost) ? "Comentário" :"Publicação" }
                        defaultValue={ groupContext.editPost?.content }
                        required
                    />
                </UniversiForm.Root>
                :
                <></>
            }
        </section>
    )

    async function handleForm( form: FeedFormData ) {
        if ( !form.confirmed ) {
            groupContext!.setEditPost( undefined );
            return;
        }

        if ( groupContext!.editPost === null )
            await UniversimeApi.Feed.createPost( groupContext!.group.id!, { authorId: groupContext!.loggedData.profile.id, content: form.body.content } );

        else if ( isGroupPostComment( groupContext!.editPost ) )
            await UniversimeApi.FeedComment.update( groupContext!.editPost.id, { content: form.body.content } );

        else
            await UniversimeApi.Feed.updatePost( groupContext!.group.id!, groupContext!.editPost?.postId!, { authorId: groupContext!.loggedData.profile.id, content: form.body.content } );

        await groupContext!.refreshData();
    }
}

type FeedFormData = UniversiForm.Data<{
    content: string;
}>;
