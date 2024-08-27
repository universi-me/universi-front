import BootstrapIcon from "@/components/BootstrapIcon";
import UniversimeApi from "@/services/UniversimeApi";
import { ServiceId, SERVICES_AVAILABLE, HealthResponseDTO } from "@/types/Health";
import { Optional } from "@/types/utils";
import { useEffect, useState } from "react";

export function HealthCheckPage() {
    const [servicesHealth, setServicesHealth] = useState(initialState);

    useEffect(() => { checkHealth() }, []);

    return <main>
        <h1>Saúde de serviços do Universi.me</h1>

        <section>
            <HealthItem serviceName="Cliente Web" health={{ up: true, name: "WEB" as ServiceId, message: undefined }} />
            {Object.entries(servicesHealth)
                .map(([s, h]) => <HealthItem key={s} health={h} serviceName={SERVICES_AVAILABLE[s as ServiceId].name} />)
            }
        </section>
    </main>;

    async function updateServiceHealth(service: ServiceId) {
        const health = await UniversimeApi.Health.checkHealth(service);
        updateStatus( service, health.body.status );
        return health;
    }

    async function unreachableServiceHealth(service: ServiceId) {
        const health: HealthResponseDTO = { up: false, name: service , message: "Serviço inacessível" };
        updateStatus( service, health );
        return health;
    }

    function updateStatus(service: ServiceId, health: HealthStatus) {
        setServicesHealth(s => {
            const state = { ...s };
            state[service] = health;
            return state;
        });
    }

    async function checkHealth() {
        const apiHealth = await updateServiceHealth("API");

        const procedure = apiHealth.success
            ? updateServiceHealth
            : unreachableServiceHealth

        Object.keys(SERVICES_AVAILABLE)
            .forEach(s => {
                const service = s as ServiceId;
                if (service !== "API") procedure(service);
            })
    }
}

type HealthItemsProps = {
    serviceName: string;
    health: HealthStatus;
};

function HealthItem(props: Readonly<HealthItemsProps>) {
    const { health, serviceName: service } = props;

    const statusIcon = health === undefined
        ? <BootstrapIcon icon="hourglass-split" style={{color:"yellow"}} />
        : health.up
            ? <BootstrapIcon icon="check-circle-fill" style={{color:"green"}} />
            : <BootstrapIcon icon="bug-fill" style={{color:"red"}} />;

    return <div key={service}>
        <h3>{service}: {statusIcon}</h3>
        {health?.message !== undefined &&
            <p>{health.message}</p>}
    </div>;
}

type HealthStatus = Optional<HealthResponseDTO>;
const initialState: Record<ServiceId, HealthStatus> = {
    API: undefined,
    MINIO: undefined,
    MONGODB: undefined,
    DATABASE: undefined,
};
