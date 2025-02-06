namespace Health {
    type ServiceId = "API" | "DATABASE" | "MONGODB" | "MINIO";

    type ResponseDTO = {
        up: boolean;
        disabled: boolean;
        name: string;
        statusMessage?: string;
        exceptionMessage?: string;
    };

    type AllResponseDTO = {
        [ k in ServiceId ]: ResponseDTO;
    };
}

type HealthResponseDTO = Health.ResponseDTO;
type HealthAllResponseDTO = Health.AllResponseDTO;
type ServiceId = Health.ServiceId;
