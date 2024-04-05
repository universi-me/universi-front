import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import DOMPurify from "dompurify";

import UniversimeApi from "@/services/UniversimeApi";
import { makeClassName } from "@/utils/tsxUtils";
import { GroupContext } from "@/pages/Group";
import { ProfileClass } from "@/types/Profile";
import { hasAvailableOption, renderOption, type OptionInMenu } from "@/utils/dropdownMenuUtils";
import * as SwalUtils from "@/utils/sweetalertUtils";

import { type GroupPost } from "@/types/Feed";
import { canI } from "@/utils/roles/rolesUtils";
import { Permission } from "@/types/Roles";

export type GroupFeedPostProps = Readonly<{
    post: GroupPost;
}>;

export function GroupFeedPost({ post }: GroupFeedPostProps) {
    const feedDescriptionId = `post-${post.postId}`;
    const [feedDescriptionElement, setFeedDescriptionElement] = useState(document.getElementById(feedDescriptionId));

    const groupContext = useContext(GroupContext);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [readMore, setReadMore] = useState<"NOT_SHOW" | "SHOW_MORE" | "SHOW_LESS">();

    const loadReadMore = () => {
        const state = descriptionState();
        if (!state) return;

        // is omitting lines
        if (state.fullHeight > state.shownHeight)
            setReadMore("SHOW_MORE");

        // is not omitting lines and not expanded, so it's smaller then the un-expanded limit
        else if (!state.isExpanded)
            setReadMore("NOT_SHOW");

        // is expanded
        else
            setReadMore("SHOW_LESS")
    }

    useEffect(() => {
        loadReadMore()
    }, [feedDescriptionElement, post.content]);

    useEffect(() => {
        setFeedDescriptionElement(document.getElementById(feedDescriptionId))
        if(readMore == undefined)
            loadReadMore()
    }, [])

    if (!groupContext)
        return null;

    const author = new ProfileClass(post.author);

    const OPTIONS_DEFINITION: OptionInMenu<GroupPost>[] = [
        {
            text: "Editar publicação",
            biIcon: "pencil-fill",
            onSelect(data) {
                groupContext.setEditPost(data);
            },
            hidden(data) {
                let canEdit = (data.author.user.ownerOfSession);
                return  !canEdit;
            },
        },
        {
            text: "Excluir publicação",
            biIcon: "trash-fill",
            className: "delete",
            onSelect: handleDeletePost,
            hidden(data) {
                return !data.author.user.ownerOfSession
                    || !canI("FEED", Permission.READ_WRITE_DELETE, groupContext.group);
            },
        }
    ]
    
    return <div className="feed-item tab-item">
        <Link to={`/profile/${author.user.name}`} className="feed-user-info">
            <img src={author.imageUrl} alt="" className="feed-image" />
            <p>{author.fullname}</p>
        </Link>

        { hasAvailableOption(OPTIONS_DEFINITION, post) && <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className="options-button">
                    <i className="bi bi-three-dots-vertical" />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content className="options" side="left">
                { OPTIONS_DEFINITION.map(def => renderOption(post, def)) }

                <DropdownMenu.Arrow className="options-arrow" height=".5rem" width="1rem" />
            </DropdownMenu.Content>
        </DropdownMenu.Root> }

        <div className="info">
            <p className={makeClassName("feed-description", "ql-editor", isExpanded && EXPANDED_CLASS)} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} id={feedDescriptionId} />
            { readMore !== "NOT_SHOW" && <p className="ler-button" onClick={toggleReadMore}>
                { readMore === "SHOW_MORE" ? "Ler mais" : "Ler menos" }
            </p> }
        </div>
    </div>

    function descriptionState() {
        if (!feedDescriptionElement)
            return undefined;

        // using the `isExpanded` state causes some bugs with it being updated differently then the other variables
        const isExpanded = feedDescriptionElement.classList.contains(EXPANDED_CLASS);
        const shownHeight = feedDescriptionElement.clientHeight;
        const fullHeight = feedDescriptionElement.scrollHeight;

        return { isExpanded, shownHeight, fullHeight };
    }

    function toggleReadMore() {

        const { isExpanded } = descriptionState() ?? {};
        const willExpand = !isExpanded;

        setIsExpanded(willExpand);
        setReadMore(willExpand ? "SHOW_LESS" : "SHOW_MORE");
    }

    function handleDeletePost() {
        SwalUtils.fireModal({
            showCancelButton: true,

            cancelButtonText: "Cancelar",
            confirmButtonText: "Excluir",
            confirmButtonColor: "var(--alert-color)",

            text: "Tem certeza que deseja excluir este post?",
            icon: "warning",
        }).then(value => {
            if (value.isConfirmed) {
                UniversimeApi.Feed
                    .deleteGroupPost({ postId: post.postId, groupId: post.groupId })
                    .then(() => groupContext!.refreshData());
            }
        })
    }

}

const EXPANDED_CLASS = "show-full-text";
