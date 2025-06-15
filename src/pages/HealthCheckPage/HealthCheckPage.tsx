import BootstrapIcon from "@/components/BootstrapIcon";
import { UniversimeApi } from "@/services"
import { SERVICES_AVAILABLE } from "@/types/Health";
import { useEffect, useState } from "react";

import "./HealthCheckPage.less";

export function HealthCheckPage() {
    const [servicesHealth, setServicesHealth] = useState(initialState);

    useEffect(() => { checkHealth() }, []);

    return <main id="health-check-page">
        <center>
            <h1>Saúde de serviços do Universi.me</h1>
            <table id="status-table">
                <tr>
                    <th>Serviço</th>
                    <th>Status</th>
                </tr>
                <HealthItem serviceName="Cliente Web" health={{ up: true, disabled: false, name: "WEB" as ServiceId, statusMessage: undefined, exceptionMessage: undefined }} />
                {Object.entries(servicesHealth)
                    .map(([s, h]) => <HealthItem key={s} health={h} serviceName={SERVICES_AVAILABLE[s as ServiceId].name} />)
                }
            </table>
            <textarea id="errors" rows={5}></textarea>
        </center>
    </main>;

    async function updateServiceHealth(service: ServiceId) {
        const health = await UniversimeApi.Health.checkHealth(service);
        updateStatus( service, health.data );
        return health;
    }

    async function unreachableServiceHealth(service: ServiceId) {
        const health: HealthResponseDTO = { up: false, disabled: false, name: service , statusMessage: "Serviço inacessível", exceptionMessage: undefined };
        updateStatus( service, health );
        return health;
    }

    function updateStatus(service: ServiceId, health: HealthStatus) {
        setServicesHealth(s => {
            const state = { ...s };
            state[service] = health;

            if(health?.exceptionMessage) {
                logToBoxConsole(SERVICES_AVAILABLE[service].name + ": " + health.exceptionMessage);
            }

            if(Object.values(state).every(h => h !== undefined && (h.up || h.disabled))) {
                logToBoxConsole("Todos os serviços estão operacionais.");
            }

            return state;
        });
    }

    async function checkHealth() {

        logToBoxConsole("Iniciando verificação de saúde dos serviços...");

        const apiHealth = await updateServiceHealth("API");

        const procedure = apiHealth.isSuccess()
            ? updateServiceHealth
            : unreachableServiceHealth

        Object.keys(SERVICES_AVAILABLE)
            .forEach(s => {
                const service = s as ServiceId;
                if (service !== "API") procedure(service);
            })
    }
}

function logToBoxConsole(message: string) {
    if(message !== undefined) {
        const div = document.getElementById('errors');
        if(div!.innerHTML.endsWith(message + "\n") === false) {
            div!.innerHTML += message + "\n";
        }
    }
}

type HealthItemsProps = {
    serviceName: string;
    health: HealthStatus;
};

function HealthItem(props: Readonly<HealthItemsProps>) {
    const { health, serviceName: service } = props;

    const statusIcon = health === undefined
        ? <BootstrapIcon icon="clock-history" style={{color:"black"}} />
        : health.up
            ? <BootstrapIcon icon="check-circle-fill" style={{color:"green"}} />
            : health.disabled ? <BootstrapIcon icon="slash-circle" style={{color:"gray"}} /> : <BootstrapIcon icon="bug-fill" style={{color:"red"}} />;

    return <tr key={service}>
        <td>{service}</td>
        <td>{statusIcon}
         {health?.statusMessage !== undefined && <p>{health.statusMessage}</p>}</td>
    </tr>;
}

type HealthStatus = Optional<HealthResponseDTO>;
const initialState: Record<ServiceId, HealthStatus> = {
    API: undefined,
    DATABASE: undefined,
    MONGODB: undefined,
    MINIO: undefined,
};
