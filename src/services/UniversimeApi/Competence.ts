import axios from "axios";

const competenceApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/competencia`,
    withCredentials: true,
});

export async function list() {
    return (await competenceApi.post('/listar', {})).data
}

export type CreateCompetenceDTO = {
    competenceTypeId: number;
    description:      string;
    level:            string;
};
export async function create(body: CreateCompetenceDTO) {
    return (await competenceApi.post("/criar", {
        competenciatipoId: body.competenceTypeId.toString(),
        descricao:         body.description,
        nivel:             body.level,
    })).data;
}

export type CompetenceUpdateDTO = {
    competenceId:     number;
    competenceTypeId: number;
    description:      string;
    level:            string;
};
export async function update(body: CompetenceUpdateDTO) {
    return (await competenceApi.post("/atualizar", {
        competenciaId:     body.competenceId.toString(),
        competenciaTipoId: body.competenceTypeId.toString(),
        descricao:         body.description,
        nivel:             body.level,
    })).data;
}

export async function remove(competenceId: number) {
    return (await competenceApi.post("/remover", {
        competenciaId: competenceId.toString(),
    })).data;
}