import BootstrapIcon from "@/components/BootstrapIcon";
import { UniversimeApi } from "@/services"
import { SERVICES_AVAILABLE } from "@/types/Health";
import { useEffect, useState } from "react";
import { convertBytes } from "@/utils/fileUtils";

import "./HealthCheckPage.less";

export function HealthCheckPage() {
    const [servicesHealth, setServicesHealth] = useState(initialState);
    const [ resourcesUsage, setResourcesUsage ] = useState<Health.Usage>();

    useEffect(() => {
        checkHealth();
        checkResourcesUsage();

        const interval = setInterval( () => {
            checkResourcesUsage();
        }, 5_000 );

        return function() { clearInterval( interval ); }
    }, []);

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

            <h1>Uso de recursos da API Rest</h1>
            <table id="usage-table">
                <tr>
                    <th>Recurso</th>
                    <th>Uso</th>
                </tr>

                <UsageItem item="cpu" value={ resourcesUsage?.cpuLoad } />
                <UsageItem item="totalMem" value={ resourcesUsage?.totalMemory } />
                <UsageItem item="freeMem" value={ resourcesUsage?.freeMemory } />
                <UsageItem item="maxMem" value={ resourcesUsage?.maxMemory } />
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

    async function checkResourcesUsage() {
        logToBoxConsole( "Iniciando verificação de uso de recursos do servidor REST..." )

        const usage = await UniversimeApi.Health.usage();
        setResourcesUsage( usage.data );
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

type UsageItemProps = {
    item: "cpu" | "maxMem" | "freeMem" | "totalMem";
    value: number | undefined;
};

const USAGE_LABELS: { [ K in UsageItemProps["item"] ]: string; } = {
    cpu: "CPU Load",
    freeMem: "Memória Livre",
    maxMem: "Memória Máxima",
    totalMem: "Memória Total",
};

function UsageItem( props: Readonly<UsageItemProps> ) {
    const { item, value } = props;

    return <tr>
        <td>{ USAGE_LABELS[ item ] }</td>
        <td>{ value === undefined
            ? <BootstrapIcon icon="clock-history" style={{color:"black"}} />
            : value < 0
                ? <>
                    <BootstrapIcon icon="bug-fill" style={{color:"red"}} />
                    <p>Indisponível</p>
                </>
                : item === "cpu"
                    ? <>{ ( value * 100 ).toFixed( 2 ) }%</>
                    : <>
                        { value } B
                        { value >= 1024 && <>
                            <br/>
                            ( { convertBytes( value, 2 ) } )
                        </> }
                    </>
        }</td>
    </tr>;
}

type HealthStatus = Optional<HealthResponseDTO>;
const initialState: Record<ServiceId, HealthStatus> = {
    API: undefined,
    DATABASE: undefined,
    MONGODB: undefined,
    MINIO: undefined,
};
