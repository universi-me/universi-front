import axios from "axios";
import { ApiResponse } from "@/types/UniversimeApi";

const imageApi = axios.create({
    baseURL: import.meta.env.VITE_UNIVERSIME_API,
    withCredentials: true,
});

export type ImageUpload_RequestDTO = {
    image: File;
};

export type ImageUpload_ResponseDTO = ApiResponse<{ link: string }>;

export async function upload(body: ImageUpload_RequestDTO) {
    const formData = new FormData();
    formData.append("imagem", body.image);

    return (await imageApi.post<ImageUpload_ResponseDTO>("/imagem/upload", formData)).data;
}
