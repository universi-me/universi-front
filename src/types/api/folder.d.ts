namespace Capacity {
    namespace Folder {
        type DTO = {
            id: string;
            reference: string;
            name: string;
            image: Nullable<string>;
            description: Nullable<string>;
            categories: Capacity.Category.DTO[];
            createdAt: string;
            rating: Rating;
            author: Profile.DTO;
            publicFolder: boolean;
            grantedAccessGroups: Group.DTO[];
            grantsBadgeToCompetences: Competence.Type[];
            canEdit: boolean;
            assignedBy: Optional<Profile.DTO[]>;
            favorite: Optional<true>;
        };

        type Rating = 0 | 1 | 2 | 3 | 4 | 5;

        type Favorite = {
            id: string;
            folder: DTO;
            created: string;
        };

        type Assignment = {
            id: string;
            created: string;
            assignedBy: Profile.DTO;
            assignedTo: Profile.DTO;
            folder: DTO;
            doneUntilNow: number;
            folderSize:   number;
        };
    }
}

type Folder = Capacity.Folder.DTO;
type FolderRating = Capacity.Folder.Rating;
type FolderFavorite = Capacity.Folder.Favorite;
type FolderProfile = Capacity.Folder.Assignment;
