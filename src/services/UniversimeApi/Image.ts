import { ApiResponse } from "@/types/UniversimeApi";
import { createApiInstance } from "./api";

const api = createApiInstance( "/imagem" )

export type ImageUpload_RequestDTO = {
    image: File;
};

export type ImageUpload_ResponseDTO = ApiResponse<{ link: string }>;

export async function upload(body: ImageUpload_RequestDTO) {
    const formData = new FormData();
    formData.append("imagem", body.image);

    return (await api.post<ImageUpload_ResponseDTO>("/upload", formData)).data;
}
