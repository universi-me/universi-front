import axios from "axios";

const competenceTypeApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/competencetype`,
    withCredentials: true,
});

export async function list() {
    return (await competenceTypeApi.post("/list", {})).data;
}
