import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "./api";
import { SERVICES_AVAILABLE } from "@/types/Health";

const api = createApiInstance( "/health" )

const HEALTH_CHECK_TIMEOUT_MS = 60_000;

export async function checkHealth( service: Health.ServiceId ) {
    const { endpoint } = SERVICES_AVAILABLE[service];

    const res = await api.get<Health.ResponseDTO>( `/${endpoint}`, { timeout: HEALTH_CHECK_TIMEOUT_MS } )
        .catch( () => null );

    return new ApiResponse( res ?? { status: 503, data: failToReach( service ) } );
}

export async function checkHealthAll() {
    const res = await api.get<Health.AllResponseDTO>("", { timeout: HEALTH_CHECK_TIMEOUT_MS, })
        .catch( () => null );

    return new ApiResponse( res ?? { status: 503, data: failToReachAll() } );
}

export async function usage() {
    const res = await api.get<Health.Usage>( "/usage", { timeout: HEALTH_CHECK_TIMEOUT_MS, } )
        .catch( () => null );

    return new ApiResponse( res ?? { status: 503, data: {
        cpuLoad: -1,
        totalMemory: -1,
        freeMemory: -1,
        maxMemory: -1,
    } } );
}

function failToReach(service: Health.ServiceId): Health.ResponseDTO {
    return {
        up: false,
        disabled: false,
        name: service,
        statusMessage: "Serviço off-line",
        exceptionMessage: "Não foi possível acessar o serviço",
    };
}

function failToReachAll(): Health.AllResponseDTO {
    return {
        API:      failToReach( "API" ),
        DATABASE: failToReach( "DATABASE" ),
        MINIO:    failToReach( "MINIO" ),
        MONGODB:  failToReach( "MONGODB" ),
    };
}
