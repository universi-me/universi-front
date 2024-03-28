
import { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";

export type FeatureToggle_RequestDTO = {
    rolesId?:        string | undefined;
    feature?:        string | undefined;
    value:           number;
}

export type FeatureToggle_ResponseDTO = ApiResponse;

export async function toggle(body:  FeatureToggle_RequestDTO) {
    return (await api.post<FeatureToggle_ResponseDTO>("/roles/feature/toggle", {
        rolesId:            body.rolesId,
        feature:            body.feature,
        value:              body.value,
    })).data;
}