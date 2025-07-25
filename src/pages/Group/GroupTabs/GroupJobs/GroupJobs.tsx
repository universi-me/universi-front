import { useContext, useRef, useState } from "react";
import DOMPurify from "dompurify";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import useCanI from "@/hooks/useCanI";
import { UniversimeApi } from "@/services"

import { Filter } from "@/components/Filter/Filter";
import { ActionButton } from "@/components/ActionButton/ActionButton";
import { ManageJob } from "@/components/ManageJob/ManageJob";
import { GroupContext, GroupContextType } from "@/pages/Group";

import StringUtils from "@/utils/stringUtils";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { makeClassName } from "@/utils/tsxUtils";
import { OptionInMenu, hasAvailableOption, renderOption } from "@/utils/dropdownMenuUtils";
import { Permission } from "@/utils/roles/rolesUtils";

import "./GroupJobs.less";
import UniversiForm from "@/components/UniversiForm";

export function GroupJobs() {
    const groupContext = useContext(GroupContext);
    const [jobsFetched, setJobsFetched] = useState(groupContext?.jobs);

    const [filterText, setFilterText] = useState<string>("");
    const filterOnlyOpen = useRef(false);
    const filterCompetenceTypes = useRef<Competence.Type[]>([]);
    const [renderFilterForm, setRenderFilterForm] = useState(false);

    const canI = useCanI();

    if (!groupContext || jobsFetched === undefined)
        return null;

    const filteredJobs = jobsFetched
        .filter(j => StringUtils.includesIgnoreCase(j.title, filterText)
            || StringUtils.includesIgnoreCase(j.shortDescription, filterText));

    return <section id="jobs" className="group-tab">
        <div className="heading top-container">
            <div className="go-right">
                <Filter placeholderMessage="Pesquisar vagas" setter={setFilterText} />

                <button type="button" id="filter-jobs-button" onClick={ () => setRenderFilterForm(r => !r) } title="Filtrar vagas">
                    <span className="bi bi-filter-circle-fill" />
                </button>

                { canI("JOBS", Permission.READ_WRITE, groupContext.group) &&
                    <ActionButton name="Criar vaga" buttonProps={{ onClick: () => groupContext.setEditJob(null) }} />
                }
            </div>
        </div>

        { (filterCompetenceTypes.current.length > 0 || filterOnlyOpen.current) &&
            <div id="filters-wrapper">
                Filtrar competências: {
                    filterOnlyOpen.current && <span className="filter-item">Abertas</span>
                } {
                    filterCompetenceTypes.current.map(
                        ct => <span className="filter-item" key={ct.id}>{ ct.name }</span>
                    )
                }
            </div>
        }

        <div id="jobs-list" className="tab-list">
            <RenderManyJobs jobs={filteredJobs} contexts={{ group: groupContext }} />
        </div>

        { groupContext.editJob !== undefined &&
            <ManageJob job={groupContext.editJob} callback={ res => res?.isSuccess()
                ? groupContext.refreshData().then( refreshJobs )
                : groupContext.setEditJob( undefined )
             } />
        }

        { renderFilterForm &&
            <UniversiForm.Root title="Filtrar por Competências" callback={ handleFilterJobs }>
                <UniversiForm.Input.Select
                    param="competences"
                    label="Deve ter as competências:"
                    options={ groupContext.competenceTypes }
                    defaultValue={ filterCompetenceTypes.current }
                    getOptionUniqueValue={ t => t.id }
                    getOptionLabel={ t => t.name }
                    isMultiSelection
                />

                <UniversiForm.Input.Switch
                    param="onlyOpen"
                    label="Apenas vagas abertas?"
                    defaultValue={ filterOnlyOpen.current }
                />
            </UniversiForm.Root>
        }
    </section>;

    async function handleFilterJobs( form: GroupJobsForm ) {
        if ( !form.confirmed ) {
            setRenderFilterForm( false );
            return;
        }

        filterOnlyOpen.current = form.body.onlyOpen;

        filterCompetenceTypes.current = form.body.competences.map(
            ctId => groupContext!.competenceTypes
                .find(ct => ct.id === ctId.id))
                .filter(ct => ct !== undefined);

        setRenderFilterForm( false );
        await refreshJobs();
    }

    async function refreshJobs() {
        const res = await UniversimeApi.Job.list({
            onlyOpen: filterOnlyOpen.current,
            competenceTypesIds: filterCompetenceTypes.current.map(ct => ct.id),
        });

        if (!res.isSuccess()) return;
        setJobsFetched(res.data);
    }
}

type GroupJobsForm = UniversiForm.Data<{
    competences: Competence.Type[];
    onlyOpen: boolean;
}>;

type RenderManyJobsProps = {
    jobs: Job.DTO[];
    contexts: {
        group: NonNullable<GroupContextType>;
    }
};

function RenderManyJobs(props: Readonly<RenderManyJobsProps>) {
    const { jobs, contexts } = props;

    if (jobs.length === 0)
        return <p className="empty-list">Nenhuma vaga encontrada.</p>

    return <>{
        jobs.map(j => <RenderJob job={j} key={j.id} contexts={contexts} />)
    }</>
}

type RenderJobProps = {
    job: Job.DTO;
    contexts: {
        group: NonNullable<GroupContextType>;
    }
};

function RenderJob(props: Readonly<RenderJobProps>) {
    const { job, contexts } = props;
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const OPTIONS: OptionInMenu<Job.DTO>[] = [
        {
            text: "Editar",
            biIcon: "pencil-fill",
            hidden(data) {
                return data.closed || !data.author.user.ownerOfSession;
            },
            onSelect(data) {
                contexts.group.setEditJob(data);
            },
        },
        {
            text: "Concluir",
            hidden(data) {
                return data.closed || !data.author.user.ownerOfSession;
            },
            async onSelect(data) {
                const res = await SwalUtils.fireAreYouSure({
                    title: "Deseja fechar a vaga?",
                    confirmButtonText: "Fechar vaga",
                });

                if (res.isConfirmed) {
                    await UniversimeApi.Job.close( data.id );
                    await contexts.group.refreshData();
                }
            }
        }
    ];

    const hoverMessage = job.closed
        ? "Essa vaga já está fechada"
        : undefined; 

    return <div className="job-item" key={job.id}>
        <div className={makeClassName("job-header", job.closed && "job-closed")} title={hoverMessage}>
            <div>
                <h3 className="job-title">
                    { job.title }
                </h3>
                <h4 className="job-institution">Ofertante: { job.institution.name }</h4>
                <p className="job-short_description">{ job.shortDescription }</p>

                { job.requiredCompetences.length > 0 &&
                    <p className="competences">
                        Competências necessárias: {
                            job.requiredCompetences.map(c => <span key={c.id} className="requirement">
                                {c.name}
                                { c.reviewed ||
                                    <i className="bi bi-exclamation-diamond-fill unreviewed-competence-warning" title="Esta competência não foi revisada por um administrador e não é visível publicamente"/>
                                }
                            </span>)
                        }
                    </p>
                }
            </div>

            <div className="go-right">
                <button type="button" className={makeClassName("job-expand", isExpanded ? "expanded" : "closed")} onClick={() => setIsExpanded(e => !e)}>
                    <span className={"bi bi-chevron-down"} />
                </button>

                { hasAvailableOption(OPTIONS, job) &&
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className="options-button">
                                <i className="bi bi-three-dots-vertical" />
                            </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Content className="job-options" side="top">
                            { OPTIONS.map(o => renderOption(job, o)) }
                            <DropdownMenu.Arrow className="options-arrow" height=".5rem" width="1rem" />
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                }
            </div>
        </div>

        { isExpanded &&
            <div className="job-long_description" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.longDescription) }} />
        }
    </div>;
}
