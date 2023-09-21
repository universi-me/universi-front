import { Group } from "@/types/Group";
import { Profile } from "@/types/Profile";

export var Types = ["Vídeo", "Documento", "Pasta"];

export type Video = {
    id:          string;
    url:         string;
    title:       string;
    image:       string | null;
    description: string | null;
    categories:  Category[] | null;
    playlists:   Folder[] | null;
    rating:      number;
    createdAt:   string;
    author:      Profile;
    type: typeof Types[number];
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
