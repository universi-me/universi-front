import { Group } from "@/types/Group";
import { Profile } from "@/types/Profile";

export type ContentType = "Vídeo" | "Documento" | "Pasta";
export const Types: ContentType[] = ["Vídeo", "Documento", "Pasta"];

export type Content = {
    id:          string;
    url:         string;
    title:       string;
    image:       string | null;
    description: string | null;
    categories:  Category[];
    playlists:   Folder[];
    rating:      number;
    createdAt:   string;
    author:      Profile;
    type:        ContentType | null;
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
