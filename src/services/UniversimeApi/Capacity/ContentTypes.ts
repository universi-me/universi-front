import type { ApiResponse } from "@/types/UniversimeApi";
import { createApiInstance } from "../api";

const api = createApiInstance( "/capacity/contentTypes" )

export type ContentType_ResponseDTO =  ApiResponse<{ tipos: string[] }>;

export async function typeList(){
    return (await api.get<ContentType_ResponseDTO>("")).data
}
