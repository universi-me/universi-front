
import { ApiResponse } from "@/types/UniversimeApi";
import { createApiInstance } from "./api";

const api = createApiInstance( "/roles/feature" )

export type FeatureToggle_RequestDTO = {
    rolesId?:        string | undefined;
    feature?:        string | undefined;
    value:           number;
}

export type FeatureToggle_ResponseDTO = ApiResponse;

export async function toggle(body:  FeatureToggle_RequestDTO) {
    return (await api.post<FeatureToggle_ResponseDTO>("/toggle", {
        rolesId:            body.rolesId,
        feature:            body.feature,
        value:              body.value,
    })).data;
}