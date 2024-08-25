import BootstrapIcon from "@/components/BootstrapIcon";
import UniversimeApi from "@/services/UniversimeApi";
import { ServiceId, SERVICES_AVAILABLE } from "@/services/UniversimeApi/Health";
import { HealthResponseDTO } from "@/types/Health";
import { Optional } from "@/types/utils";
import { useEffect, useState } from "react";

export function HealthCheckPage() {
    const [servicesHealth, setServicesHealth] = useState(initialState);

    useEffect(() => { checkHealth() }, []);

    return <main>
        <h1>Saúde de serviços do Universi.me</h1>

        <section>
            <HealthItem serviceName="Cliente Web" health={{ up: true, message: undefined }} />
            {Object.entries(servicesHealth)
                .map(([s, h]) => <HealthItem key={s} health={h} serviceName={SERVICES_AVAILABLE[s as ServiceId].name} />)
            }
        </section>
    </main>;

    async function updateServiceHealth(service: ServiceId) {
        const health = await UniversimeApi.Health.checkHealth(service);
        setServicesHealth(s => {
            const state = { ...s };
            state[service] = health;
            return state;
        });
        return health;
    }

    async function checkHealth() {
        const apiHealth = await updateServiceHealth("API");

        const procedure: (s: ServiceId) => Promise<HealthStatus> = apiHealth.up
            ? updateServiceHealth
            : s => Promise.resolve({ up: false, message: "Serviço inacessível" });

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
