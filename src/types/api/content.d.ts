namespace Capacity {
    namespace Content {
        type DTO = {
            id: string;
            url: string;
            title: string;
            image: Nullable<string>;
            description: Nullable<string>;
            categories: Capacity.Category.DTO[];
            rating: Rating;
            createdAt: string;
            author: Profile.DTO;
            type: Type;
            status: Optional<Status>;
        };

        type Rating = 0 | 1 | 2 | 3 | 4 | 5;

        type Type = "VIDEO" | "LINK" | "FOLDER" | "FILE";

        type Status = "VIEW" | "DONE" | "NOT_VIEWED";

        type WatchProgress = {
            content: DTO;
            status: Status;
        };
    }
}
