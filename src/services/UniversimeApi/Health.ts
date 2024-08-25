import { HealthResponseDTO } from "@/types/Health";
import { api } from "./api";

const HEALTH_CHECK_TIMEOUT_MS = 10_000;
const FAIL_TO_REACH_RESPONSE: HealthResponseDTO = {
    up: false,
    message: "Serviço off-line"
};

export async function checkHealth( service: ServiceId ) {
    const { endpoint } = SERVICES_AVAILABLE[service];

    const res = await api.get<HealthResponseDTO>("/health/" + endpoint, {
        timeout: HEALTH_CHECK_TIMEOUT_MS,
    }).catch(err => ({data: FAIL_TO_REACH_RESPONSE}));

    if (!res)
        return FAIL_TO_REACH_RESPONSE;

    else
        return res.data;
}

export type ServiceId = "API" | "DATABASE" | "MONGODB" | "MINIO";

export const SERVICES_AVAILABLE: { [k in ServiceId]: Service } = {
    API:      { name: "API",            endpoint: "api" },
    DATABASE: { name: "Banco de Dados", endpoint: "database" },
    MONGODB:  { name: "MongoDB",        endpoint: "mongodb" },
    MINIO:    { name: "MinIO",          endpoint: "minio"   },
};

type Service = {
    name: string;
    endpoint: string;
};
