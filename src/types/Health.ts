export const SERVICES_AVAILABLE: { [k in Health.ServiceId]: Service } = {
    API:      { name: "API",            endpoint: "api" },
    DATABASE: { name: "Banco de Dados", endpoint: "database" },
    MONGODB:  { name: "MongoDB",        endpoint: "mongodb" },
    MINIO:    { name: "MinIO",          endpoint: "minio" },
};

type Service = {
    name: string;
    endpoint: string;
};
