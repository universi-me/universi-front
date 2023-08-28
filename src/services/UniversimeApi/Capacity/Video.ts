import axios from "axios";

const videoApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/capacity/video`,
    withCredentials: true,
});

export type VideoIdDTO = {
    id: string;
};

export type VideoCreateDTO = {
    url:                 string;
    title:               string;
    description?:        string;
    addCategoriesByIds?: string | string[];
    addPlaylistsByIds?:  string | string[];
    rating?:             number;
    image?:              string;
};

export type VideoEditDTO = {
    id:                     string;
    url?:                   string;
    title?:                 string;
    description?:           string;
    addCategoriesByIds?:    string | string[];
    removeCategoriesByIds?: string | string[];
    addPlaylistsByIds?:     string | string[];
    removePlaylistsByIds?:  string | string[];
    rating?:                number;
    image?:                 string;
};

export async function getVideo(body: VideoIdDTO) {
    return (await videoApi.post("/get", {
        id: body.id,
    })).data;
}

export async function createVideo(body: VideoCreateDTO) {
    return (await videoApi.post("/create", {
        url:                body.url,
        title:              body.title,
        image:              body.image,
        description:        body.description,
        rating:             body.rating,
        addCategoriesByIds: body.addCategoriesByIds,
        addPlaylistsByIds:  body.addPlaylistsByIds,
    })).data;
}

export async function editVideo(body: VideoEditDTO) {
    return (await videoApi.post("/edit", {
        id:                    body.id,
        url:                   body.url,
        title:                 body.title,
        image:                 body.image,
        description:           body.description,
        rating:                body.rating,
        addCategoriesByIds:    body.addCategoriesByIds,
        removeCategoriesByIds: body.removeCategoriesByIds,
        addPlaylistsByIds:     body.addPlaylistsByIds,
        removePlaylistsByIds:  body.removePlaylistsByIds,
    })).data;
}

export async function removeVideo(body: VideoIdDTO) {
    return (await videoApi.post("/delete", {
        id: body.id,
    })).data;
}
