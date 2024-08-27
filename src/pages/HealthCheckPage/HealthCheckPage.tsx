import BootstrapIcon from "@/components/BootstrapIcon";
import UniversimeApi from "@/services/UniversimeApi";
import { ServiceId, SERVICES_AVAILABLE, HealthResponseDTO } from "@/types/Health";
import { Optional } from "@/types/utils";
import { useEffect, useState } from "react";

import "./HealthCheckPage.css";

export function HealthCheckPage() {
    const [servicesHealth, setServicesHealth] = useState(initialState);

    useEffect(() => { checkHealth() }, []);

    return <main>
        <center>
            <h1>Saúde de serviços do Universi.me</h1>
            <table>
                <tr>
                    <th>Serviço</th>
                    <th>Status</th>
                </tr>
                <HealthItem serviceName="Cliente Web" health={{ up: true, name: "WEB" as ServiceId, statusMessage: undefined, exceptionMessage: undefined }} />
                {Object.entries(servicesHealth)
                    .map(([s, h]) => <HealthItem key={s} health={h} serviceName={SERVICES_AVAILABLE[s as ServiceId].name} />)
                }
            </table>
            <textarea id="errors" rows={5}></textarea>
        </center>
    </main>;

    async function updateServiceHealth(service: ServiceId) {
        const health = await UniversimeApi.Health.checkHealth(service);
        updateStatus( service, health.body.status );
        return health;
    }

    async function unreachableServiceHealth(service: ServiceId) {
        const health: HealthResponseDTO = { up: false, name: service , statusMessage: "Serviço inacessível", exceptionMessage: undefined };
        updateStatus( service, health );
        return health;
    }

    function updateStatus(service: ServiceId, health: HealthStatus) {
        setServicesHealth(s => {
            const state = { ...s };
            state[service] = health;

            if(health && health!.exceptionMessage) {
                logToBoxConsole(service + ": " + health.exceptionMessage);
            }

            if(Object.values(state).every(h => h !== undefined && h.up)) {
                logToBoxConsole("Todos os serviços estão operacionais.");
            }

            return state;
        });
    }

    async function checkHealth() {

        logToBoxConsole("Iniciando verificação de saúde dos serviços...");

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

function logToBoxConsole(message: string) {
    if(message !== undefined) {
        var div = document.getElementById('errors');
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
            : <BootstrapIcon icon="bug-fill" style={{color:"red"}} />;

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
