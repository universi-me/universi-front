import axios from "axios";

const categoryApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/capacity/category`,
    withCredentials: true,
});

export type CategoryIdDTO = {
    id: string;
};

export type CategoryCreateDTO = {
    name:  string;
    image: string;
};

export type CategoryEditDTO = {
    id:     string;
    name?:  string;
    image?: string;
};

export async function getCategory(body: CategoryIdDTO) {
    return (await categoryApi.post("/get", {
        id: body.id,
    })).data;
}

export async function createCategory(body: CategoryCreateDTO) {
    return (await categoryApi.post("/create", {
        name:  body.name,
        image: body.image,
    })).data;
}

export async function editCategory(body: CategoryEditDTO) {
    return (await categoryApi.post("/edit", {
        id:    body.id,
        name:  body.name,
        image: body.image,
    })).data;
}

export async function removeCategory(body: CategoryIdDTO) {
    return (await categoryApi.post("/delete", {
        id: body.id,
    })).data;
}

export async function videosInCategory(body: CategoryIdDTO) {
    return (await categoryApi.post("/videos", {
        id: body.id,
    })).data;
}
