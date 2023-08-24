import axios from "axios";

const capacityApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/capacitacao`,
    withCredentials: true,
});

export type VideoIdDTO = {
    id: string;
};

export type VideoCreateDTO = {
    id:          string | null;
    url:         string;
    title:       string;
    description: string;
    category:    string;
    playlist:    string;
    rating:      number;
    createdAt:   Date;
};

export type VideoEditDTO = {
    id:          string;
    url:         string;
    title:       string;
    description: string;
    category:    string;
    playlist:    string;
    rating:      number;
    createdAt:   Date;
};

export type CategoryDTO = {
    category: string;
}

export type PlaylistDTO = {
    playlist: string;
}

export async function videoList() {
    return (await capacityApi.get("/gerenciador-capacitacao")).data;
}

export async function getVideo(body: VideoIdDTO) {
    return (await capacityApi.get(`/video/${body.id}`)).data;
}

export async function createVideo(body: VideoCreateDTO) {
    return (await capacityApi.post("/add", body)).data;
}

export async function editVideo(body: VideoEditDTO) {
    return (await capacityApi.put(`/edit/${body.id}`)).data;
}

export async function removeVideo(body: VideoIdDTO) {
    return (await capacityApi.delete(`/delete/${body.id}`)).data;
}

export async function videosInCategory(body: CategoryDTO) {
    return (await capacityApi.get(`/categoria/${body.category}`)).data;
}

export async function videosInPlaylist(body: PlaylistDTO) {
    return (await capacityApi.get(`/playlist/${body.playlist}`)).data;
}
