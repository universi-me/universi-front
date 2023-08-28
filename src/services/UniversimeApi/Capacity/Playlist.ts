import axios from "axios";

const playlistApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/capacity/playlist`,
    withCredentials: true,
});

export type PlaylistIdDTO = {
    id: string;
};

export type PlaylistCreateDTO = {
    name:                string;
    image?:              string;
    description?:        string;
    rating?:             number;
    addCategoriesByIds?: string | string[];
};

export type PlaylistEditDTO = {
    id:                     string;
    name?:                  string;
    image?:                 string;
    description?:           string;
    rating?:                number;
    removeCategoriesByIds?: string | string[];
    addCategoriesByIds?:    string | string[];
};

export type VideoAndPlaylistDTO = {
    playlistId: string;
    videoIds:   string | string[];
};

export async function getPlaylist(body: PlaylistIdDTO) {
    return (await playlistApi.post("/get", {
        id: body.id,
    })).data;
}

export async function createPlaylist(body: PlaylistCreateDTO) {
    return (await playlistApi.post("/create", {
        name:               body.name,
        image:              body.image,
        description:        body.description,
        rating:             body.rating,
        addCategoriesByIds: body.addCategoriesByIds,
    })).data;
}

export async function editPlaylist(body: PlaylistEditDTO) {
    return (await playlistApi.post("/edit", {
        id:                    body.id,
        name:                  body.name,
        image:                 body.image,
        description:           body.description,
        rating:                body.rating,
        removeCategoriesByIds: body.removeCategoriesByIds,
        addCategoriesByIds:    body.addCategoriesByIds,
    })).data;
}

export async function removePlaylist(body: PlaylistIdDTO) {
    return (await playlistApi.post("/delete", {
        id: body.id,
    })).data;
}

export async function videosInPlaylist(body: PlaylistIdDTO) {
    return (await playlistApi.post("/videos", {
        id: body.id,
    })).data;
}

export async function addVideoToPlaylist(body: VideoAndPlaylistDTO) {
    return (await playlistApi.post("/video/add", {
        id:      body.playlistId,
        videoIds: body.videoIds,
    })).data;
}

export async function removeVideoFromPlaylist(body: VideoAndPlaylistDTO) {
    return (await playlistApi.post("/video/remove", {
        id:      body.playlistId,
        videoIds: body.videoIds,
    })).data;
}
