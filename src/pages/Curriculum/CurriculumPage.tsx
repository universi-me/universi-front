import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

import { AuthContext } from "@/contexts/Auth";
import { UniversimeApi } from "@/services/UniversimeApi";

import { Component, ComponentType } from "@/types/CurriculumComp";
import { TextAlignCenter } from "phosphor-react";

export function CurriculumPage() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams();

    const [listTypes, setTypes] = useState<ComponentType[]>([]);
    const [listComponents, setComponents] = useState<Component[]>([]);

    //se a pessoa não tiver autenticada, volta pra tela de login
    if (auth.user === null) {
        navigate('/login');
    }

    //Assim que acessa a pagina, vai carregar tudo o que esse metodo busca
    useEffect(() => { loadAccessed() }, [id]);

    return (
        <div id="curriculum-page">

            <div id="user-header-bar" style={{ background: "#515151" }} />

            {/* precisa colocar aquela sidebar com as ibnformações do perfil */}

            <div>
                <h1 style={{ textAlign: 'center' }}> Meu Curriculo </h1>
                {/* essa tag cria uma linha reta para separar os dados */}
                <hr />
            </div>

            {
                listTypes.map((types) => {
                    return (
                        <div>
                            <h2 style={TextAlignCenter}>
                                {types.name}
                            </h2>
                            <hr />
                            {
                                listComponents.map((component) => {
                                    if (component.componentType.name.match(types.name)) {
                                        return (
                                            <div>
                                                <h3 style={TextAlignCenter}>
                                                    {component.title}
                                                </h3>
                                                {/* outras informações */}
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
                    )
                })
            }

        </div>
    )

    async function loadAccessed() {

        //Carregando os tipos dos componentes
        const types = Promise.all([UniversimeApi.CurriculumCompType.list()]);
        types.then((data: ComponentType[]) => setTypes(data));

        //Carregando os componentes
        const components = Promise.all([UniversimeApi.CurriculumComp.list()]);
        components.then((data: Component[]) => setComponents(data));
    }
}