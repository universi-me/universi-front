import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import DOMPurify from "dompurify";

import UniversimeApi from "@/services/UniversimeApi";
import { makeClassName } from "@/utils/tsxUtils";
import { GroupContext } from "@/pages/Group";
import { ProfileClass } from "@/types/Profile";
import * as SwalUtils from "@/utils/sweetalertUtils";

import { type GroupPost } from "@/types/Feed";

export type GroupFeedPostProps = Readonly<{
    post: GroupPost;
}>;

export function GroupFeedPost({ post }: GroupFeedPostProps) {
    const feedDescriptionId = `post-${post.postId}`;
    const feedDescriptionElement = document.getElementById(feedDescriptionId);

    const groupContext = useContext(GroupContext);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [readMore, setReadMore] = useState("NOT_SHOW");

    useEffect(() => {
        const state = descriptionState();
        if (!state) return;

        if (state.fullHeight > state.shownHeight)
            setReadMore("SHOW_MORE");
    }, [feedDescriptionElement]);

    if (!groupContext)
        return null;

    const author = new ProfileClass(post.author);

    return <div className="feed-item tab-item">
        <Link to={`/profile/${author.user.name}`} className="feed-user-info">
            <img src={author.imageUrl} alt="" className="feed-image" />
            <p>{author.fullname}</p>
        </Link>

        { groupContext.group.canEdit && <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className="options-button">
                    <i className="bi bi-three-dots-vertical" />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content className="options" side="left">
                <DropdownMenu.Item className="dropdown-options-item" onSelect={() => groupContext.setEditPost(post)} hidden={!post.author.user.ownerOfSession}>
                    Editar publicação <i className="bi bi-pencil-fill right-slot" />
                </DropdownMenu.Item>

                <DropdownMenu.Item className="dropdown-options-item" onSelect={handleDeletePost} hidden={!post.author.user.ownerOfSession}>
                    Excluir publicação <i className="bi bi-trash-fill right-slot" />
                </DropdownMenu.Item>
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
        const { isExpanded } = descriptionState()!;
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
