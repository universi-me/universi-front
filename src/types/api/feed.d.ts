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

    type Comment = Post & {
        id: string;
        groupPostId: string;
        content : string;
        author : Profile.DTO;
        authorId : string;
    };

    type GroupPost = {
        content: string;
        author: Profile.DTO;
        postId: string;
        groupId: string;
        reactions: Reaction[];
        comments: Comment[];
    };
}
