import { Optional } from "./utils";

export type HealthResponseDTO = {
    up: boolean;
    name: ServiceId;
    message: Optional<string>;
};

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
