import { Profile } from "@/types/Profile";

export type Video = {
    id:          string;
    url:         string;
    title:       string;
    image:       string | null;
    description: string | null;
    category:    Category | null;
    // playlist:    string;
    rating:      number;
    createdAt:   string;
    author:      Profile;
};

export type Category = {
    id:        string;
    name:      string;
    image:     string | null;
    createdAt: string;
    author:    Profile;
};
