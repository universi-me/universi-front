import { Group } from "@/types/Group";
import { Profile } from "@/types/Profile";


export type ContentStatusEnum = "VIEW" | "DONE" | "NOT_VIEWED"
export type ContentStatus = {status : ContentStatusEnum, updatedAt: string}
export type ContentType = "VIDEO" | "LINK" | "FOLDER" | "FILE";
export const Types: ContentType[] = ["VIDEO", "LINK", "FOLDER", "FILE"];


export type Content = {
    id:                 string;
    url:                string;
    title:              string;
    image:              string | null;
    description:        string | null;
    categories:         Category[];
    folders:            Folder[];
    rating:             number;
    createdAt:          string;
    author:             Profile;
    type:               ContentType | null;
    contentStatus :     ContentStatus;
};

export type Category = {
    id:        string;
    name:      string;
    image:     string | null;
};

export type Folder = {
    id:                  string;
    name:                string;
    image:               string | null;
    description:         string | null;
    rating:              number;
    categories:          Category[];
    createdAt:           string;
    author:              Profile;
    publicFolder:        boolean;
    grantedAccessGroups: Group[];
};
