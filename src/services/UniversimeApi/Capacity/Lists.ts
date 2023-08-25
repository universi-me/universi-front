import axios from "axios";

const capacityApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/capacity`,
    withCredentials: true,
});

export async function videoList() {
    return (await capacityApi.get("/videos")).data;
}

export async function categoryList() {
    return (await capacityApi.get("/categories")).data;
}

export async function playlistList() {
    return (await capacityApi.get("/playlists")).data;
}
