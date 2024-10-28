import { api } from "./api";
import { HealthResponseDTO, ServiceId, SERVICES_AVAILABLE } from "@/types/Health";
import { ApiResponse } from "@/types/UniversimeApi";

const HEALTH_CHECK_TIMEOUT_MS = 60_000;

export type CheckHealth_ResponseDTO = ApiResponse<{ status: HealthResponseDTO }, { status: HealthResponseDTO }>;
export type CheckHealthAll_ResponseDTO = ApiResponse<{ status: { [k in ServiceId]: HealthResponseDTO } }, { status: { [k in ServiceId]: HealthResponseDTO } }>;

export async function checkHealth( service: ServiceId ) {
    const { endpoint } = SERVICES_AVAILABLE[service];

    const res = await api.get<CheckHealth_ResponseDTO>("/health/" + endpoint, {
        timeout: HEALTH_CHECK_TIMEOUT_MS,
    }).catch(err => ({data: failToReach(service)}));

    return !!res
        ? res.data
        : failToReach(service);
}

export async function checkHealthAll() {
    const res = await api.get<CheckHealthAll_ResponseDTO>("/health/all", {
        timeout: HEALTH_CHECK_TIMEOUT_MS,
    }).catch( err => ({ data: failToReach("ALL" as ServiceId) }) );

    return !!res
        ? res.data
        : failToReach("ALL" as ServiceId);
}

function failToReach(service: ServiceId): CheckHealth_ResponseDTO {
    return {
        success: false,
        body: {
            status: {
                up: false,
                disabled: false,
                name: service,
                statusMessage: "Serviço off-line",
                exceptionMessage: "Não foi possível acessar o serviço",
            }
        }
    }
}
