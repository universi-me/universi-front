import type { Component } from "@/types/CurriculumComp";
import type { ApiResponse } from "@/types/UniversimeApi";
import axios from "axios";

const ComponentApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/curriculum`,
    withCredentials: true,
});

export type ComponentCreate_RequestDTO = {
    title:            string;
    description:      string;
    componentTypeId:  string;
    startDate:        Date;
    endDate:          Date;
    presentDate:      Boolean;
};

export type ComponentUpdate_RequestDTO = {
    componentId:      string;
    title:            string;
    description:      string;
    componentTypeId:  string;
    endDate:          Date;
    presentDate:      Boolean;
};

export type ComponentId_RequestDTO = {
    idComponent?: string;
};

export type ComponentGet_ResponseDTO =    ApiResponse<{ componente: Component }>;
export type ComponentCreate_ResponseDTO = ApiResponse;
export type ComponentUpdate_ResponseDTO = ApiResponse;
export type ComponentRemove_ResponseDTO = ApiResponse;
export type ComponentList_ResponseDTO =   ApiResponse<{ lista: Component[] }>;

// Certificar se as URLS estão corretas
// Certificar tudo isso para CurriculumType também

// Certificar se o get tá recebendo paramentros certos
export async function get(param: ComponentId_RequestDTO) {
    return (
        await ComponentApi.get<ComponentGet_ResponseDTO, ComponentList_ResponseDTO>
            ("/componente")
    );
}

// Certificar se tá faltando algum dado
export async function create(body: ComponentCreate_RequestDTO) {
    return (await ComponentApi.post<ComponentCreate_ResponseDTO>("/criar", {
        titulo:          body.title,
        descricao:       body.description,
        tipoComponente:  body.componentTypeId,
        diaInicio:       body.startDate,
        diaTermino:      body.endDate,
        atuando:         body.presentDate,
    })).data;
}

// Certificar se tá faltando algum dado
export async function update(body: ComponentUpdate_RequestDTO) {
    return (await ComponentApi.post<ComponentUpdate_ResponseDTO>("/atualizar", {
        componenteId:     body.componentId,
        titulo:           body.title,
        descricao:        body.description,
        componenteTipoId: body.componentTypeId,
        diaFinal:         body.endDate,
        atuando:          body.presentDate,
    })).data;
}

export async function remove(body: ComponentId_RequestDTO) {
    return (await ComponentApi.post<ComponentRemove_ResponseDTO>("/remover", {
        componenteId: body.idComponent,
    })).data;
}

// Certificar se nesse caso seria um post e se existe esse endpoint
export async function list() {
    return (await ComponentApi.get<ComponentGet_ResponseDTO, Component>('/profile'));
}
