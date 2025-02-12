import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "./api";

const api = createApiInstance( "/img" )


export async function upload( body: ImageUpload_RequestDTO ) {
    const formData = new FormData();
    formData.append("image", body.image);

    const res = await api.post<undefined>( "", formData );
    return new ApiResponse<string>({
        data: res.headers.Location,
        status: res.status,
    })
}

export type ImageUpload_RequestDTO = {
    image: File;
};

export type ImageUpload_ResponseDTO = ApiResponse<{ link: string }>;

