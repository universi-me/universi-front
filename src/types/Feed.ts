export function isGroupPostComment(post: Feed.GroupPost | Feed.GroupPostComment | null | undefined): post is Feed.GroupPostComment {
    return !!post && "id" in post;
}
