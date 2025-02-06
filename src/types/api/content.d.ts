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
            status: Optional<Status.Type>;
        };

        type Rating = 0 | 1 | 2 | 3 | 4 | 5;

        type Type = "VIDEO" | "LINK" | "FOLDER" | "FILE";

        namespace Status {
            type DTO = {
                status: Type;
                updatedAt: string;
            };

            type Type = "VIEW" | "DONE" | "NOT_VIEWED";
        }

        type WatchProgress = {
            content: DTO;
            status: Status.Type;
        };
    }
}

type Content = Capacity.Content.DTO;
type ContentRating = Capacity.Content.Rating;
type ContentType = Capacity.Content.Type;
type ContentStatus = Capacity.Content.Status.DTO;
type ContentStatusEnum = Capacity.Content.Status.Type;
type WatchProfileProgress = Capacity.Content.WatchProgress;
