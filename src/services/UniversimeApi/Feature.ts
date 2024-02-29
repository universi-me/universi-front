
import { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";

export type FeatureToggle_RequestDTO = {
    paperId?:        string | undefined;
    feature?:        string | undefined;
    value:           number;
}

export type FeatureToggle_ResponseDTO = ApiResponse;

export async function toggle(body:  FeatureToggle_RequestDTO) {
    return (await api.post<FeatureToggle_ResponseDTO>("/paper/feature/toggle", {
        paperId:            body.paperId,
        feature:            body.feature,
        value:              body.value,
    })).data;
}