import { Profile } from "@/types/Profile";

export type Video = {
    id:          string;
    url:         string;
    title:       string;
    image:       string | null;
    description: string | null;
    categories:  Category[] | null;
    playlists:   Playlist[];
    rating:      number;
    createdAt:   string;
    author:      Profile;
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
