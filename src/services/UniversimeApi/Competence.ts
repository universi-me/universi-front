import axios from "axios";

const competenceApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/competencia`,
    withCredentials: true,
});

export async function list() {
    return (await competenceApi.post('/listar', {})).data
}

export type CreateCompetenceDTO = {
    competenceTypeId: string;
    description:      string;
    level:            string;
};

export type CompetenceUpdateDTO = {
    competenceId:     string;
    competenceTypeId: string;
    description:      string;
    level:            string;
};

export type CompetenceIdDTO = {
    competenceId: string;
};

export async function create(body: CreateCompetenceDTO) {
    return (await competenceApi.post("/criar", {
        competenciatipoId: body.competenceTypeId,
        descricao:         body.description,
        nivel:             body.level,
    })).data;
}

export async function update(body: CompetenceUpdateDTO) {
    return (await competenceApi.post("/atualizar", {
        competenciaId:     body.competenceId,
        competenciaTipoId: body.competenceTypeId,
        descricao:         body.description,
        nivel:             body.level,
    })).data;
}

export async function remove(body: CompetenceIdDTO) {
    return (await competenceApi.post("/remover", {
        competenciaId: body.competenceId,
    })).data;
}
