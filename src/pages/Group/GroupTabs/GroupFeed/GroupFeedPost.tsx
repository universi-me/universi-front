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

import { GroupPostReaction, type GroupPost } from "@/types/Feed";
import useCanI from "@/hooks/useCanI";
import { Permission } from "@/types/Roles";

import { ICON_LIKE, ICON_CLAP, ICON_HEART, ICON_SUPPORT, ICON_GENIUS, ICON_HAPPY } from '@/utils/assets';

export type GroupFeedPostProps = Readonly<{
    post: GroupPost;
}>;

export function GroupFeedPost({ post }: GroupFeedPostProps) {
    const feedDescriptionId = `post-${post.postId}`;
    const [feedDescriptionElement, setFeedDescriptionElement] = useState(document.getElementById(feedDescriptionId));

    const groupContext = useContext(GroupContext);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [readMore, setReadMore] = useState<"NOT_SHOW" | "SHOW_MORE" | "SHOW_LESS">();

    const canI = useCanI();

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
                return !data.author.user.ownerOfSession;
            },
        },
        {
            text: "Excluir publicação",
            biIcon: "trash-fill",
            className: "delete",
            onSelect: handleDeletePost,
            hidden(data) {
                return !data.author.user.ownerOfSession
                    && !canI("FEED", Permission.READ_WRITE_DELETE, groupContext.group);
            },
        }
    ]

    const REACTIONS_LIST = [
        { reaction: 'like', name: 'Gostei', icon: ICON_LIKE },
        { reaction: 'clap', name: 'Parabéns', icon: ICON_CLAP },
        { reaction: 'support', name: 'Apoio', icon: ICON_SUPPORT },
        { reaction: 'heart', name: 'Amei', icon: ICON_HEART },
        { reaction: 'genius', name: 'Genial', icon: ICON_GENIUS },
        { reaction: 'happy', name: 'Divertido', icon: ICON_HAPPY },
    ];

    const [showReactions, setShowReactions] = useState(false);
    const [selectedReaction, setSelectedReaction] = useState<any>(null);
    const [hoveredReaction, setHoveredReaction] = useState<any>(null);

    const [showReactionsPost, setShowReactionsPost] = useState<GroupPost | null>(null);

    useEffect(() => {
        REACTIONS_LIST.map((reaction) => (
            isMyReaction(post, reaction.reaction) && setSelectedReaction(reaction)
        ))
    }, [post, feedDescriptionElement]);
    
    return <div className="feed-item tab-item">
        <Link to={`/profile/${author.user.name}`} className="feed-user-info">
            <img src={author.imageUrl} alt="" className="feed-image" />
            <p>{author.fullname}</p>
        </Link>

        {showReactionsPost && (
            <div className="reactions-modal" onClick={() => setShowReactionsPost(null)}>
                <div className="reactions-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="reactions-modal-header">
                        <h3>Reações</h3>
                        <button className="reactions-modal-close" onClick={() => setShowReactionsPost(null)}>✖</button>
                    </div>
                    <div className="reactions-modal-body">
                        {REACTIONS_LIST.map((reaction) => (
                            countReaction(showReactionsPost, reaction.reaction) > 0 &&
                            <div key={reaction.name} className="reaction-modal">
                                <img src={reaction.icon} height={18} width={18} />
                                <p>{countReaction(showReactionsPost, reaction.reaction)} {reaction.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

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
                <div className="learn-more">{ readMore === "SHOW_MORE" ? "Ler mais" : "Ler menos" }</div>
            </p> }

            <div className="post-actions-info">

            {countReactions(post) > 0 &&
                <div className="post-info-reaction">
                    <div className="reaction-icons">
                        {REACTIONS_LIST.map((reaction) => (
                        countReaction(post, reaction.reaction) > 0 &&
                            <div key={reaction.name} className="reaction-icon">
                                <img src={reaction.icon} height={18} width={18} />
                            </div>
                        ))}
                    </div>
                    <div className="reaction-count" onClick={() => setShowReactionsPost(post)}>
                        {countReactions(post)} pessoa(s) reagiram
                    </div>
                </div>
            }

            </div>

            <div className="post-separator" />
            
            <div className="post-actions">

      <div 
        className={selectedReaction ? "like-button like-button-selected" : "like-button"}
        onMouseEnter={() => setShowReactions(true)}
        onMouseLeave={() => setShowReactions(false)}
        onClick={() => hoveredReaction==null && reactToPost(post, selectedReaction ? selectedReaction.reaction : REACTIONS_LIST[0].reaction)()}
      >

        <div className="like-button-content">
            <div>{selectedReaction ? <img src={selectedReaction.icon} height={20} width={20} /> : <img src={ICON_LIKE} height={20} width={20} /> }</div>
            <div>{selectedReaction ? selectedReaction.name : 'Curtir'}</div>
        </div>

        { showReactions && (
          <div className="reaction-popup">
            
            { REACTIONS_LIST.map((reaction) => (
              <div 
                key={reaction.name}
                className={ (selectedReaction && selectedReaction.reaction == reaction.reaction) ? "reaction reaction-selected" : "reaction"}
                onClick={() => { reactToPost(post, reaction.reaction)(); }}
                onMouseEnter={() => setHoveredReaction(reaction)}
                onMouseLeave={() => setHoveredReaction(null)}
              >
                {<img src={reaction.icon} height={42} width={42} />}
              </div>
            ))}

            { hoveredReaction && (
              <div className="reaction-tooltip">
                {hoveredReaction.name}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="comment-button" hidden>💬 Comentar</div>
    </div>

            
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
            confirmButtonColor: "var(--font-color-alert)",

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

    function reactToPost(post: GroupPost, reaction: string) {
        return () => {
            setSelectedReaction(isMyReaction(post, reaction) ? null : REACTIONS_LIST.find(r => r.reaction === reaction));
            UniversimeApi.Feed.reactGroupPost({
                groupPostId: post.postId,
                reaction: isMyReaction(post, reaction) ? '0' : reaction,
            }).then(() => {
                groupContext!.refreshData()
            });
        }
    }

    function countReaction(post: GroupPost, reaction: string): number {
        return (post.reactions ?? ([] as GroupPostReaction[])).filter(r => r.reaction === reaction).length;
    }

    function getReactionCount(post: GroupPost, reaction: string): string {
        return countReaction(post, reaction).toString();
    }

    function countReactions(post: GroupPost): number {
        return REACTIONS_LIST.reduce((acc, reaction) => acc + countReaction(post, reaction.reaction), 0);
    }

    function isMyReaction(post: GroupPost, reaction: string): boolean {
        return (post.reactions ?? ([] as GroupPostReaction[])).some(r => r.reaction === reaction && r.authorId === groupContext!.loggedData.profile.id);
    }

}

const EXPANDED_CLASS = "show-full-text";
