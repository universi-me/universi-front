import { Profile } from "@/types/Profile";

export var Types = ["Vídeo", "Documento", "Pasta"];

export type Video = {
    id:          string;
    url:         string;
    title:       string;
    image:       string | null;
    description: string | null;
    categories:  Category[] | null;
    playlists:   Playlist[] | null;
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

export type Playlist = {
    id:          string;
    name:        string;
    image:       string | null;
    description: string | null;
    rating:      number | null;
    categories:  Category[] | null;
    createdAt:   string;
    author:      Profile;
};
