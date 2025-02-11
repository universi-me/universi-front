namespace Feed {
    type Post = {
        reactions: Reaction[];
        comments: Comment[];
        postId: string;
        groupId: string;
        content: string;
        authorId: string;
        author: Profile.DTO;
    };

    type Reaction = {
        reaction: string;
        groupPostId: string;
        authorId: string;
    };

    type Comment = {
        id: string;
        groupPostId: string;
        content : string;
        authorId : string;
    };

    type GroupPost = {
        content: string;
        author: Profile.DTO;
        postId: string;
        groupId: string;
        reactions: Reaction[];
        comments: GroupPostComment[];
    };

    type GroupPostComment = {
        id: string;
        content: string;
        authorId: string;
        author: Profile.DTO;
    };
}

type GroupPost = Feed.Post;
type GroupGetPostDTO = Feed.GroupPost;
type GroupPostComment = Feed.Comment;
type GroupPostReaction = Feed.Reaction;
