import { App } from "../App";
import {createBrowserRouter} from 'react-router-dom'
import Singin from "../../src/pages/singin/Singin";
import Profile from "../../src/pages/profile/Profile";
import { OAuth2Element }  from './oauth2-google';



export const router = createBrowserRouter([{
  path: "/",
  element: <App/>,
  //todo: errorElement: Erro404page,
  children: [
    {
      // todo: path: "/",
      // todo: element: Homepage
    },
    {
      //todo: path: "NomeDoCaminho",
      //todo: element: <Pagina/>
    },
    {//identificador unico - dynamic routes
      //path: "perfil/:id",
      //element: <></>
    },
    {//navigate para paginas não existentes - redireciona o caminho de paginas que uma vez existiram, 
     // mas não existem mais, para o caminho novo, certo.
      // path: "caminhoantigo",
      // element: <Navigate to = "/novocaminho"/>

    },
    {
      path: "/login",
      element: <Singin/>
    },
    {
        path: "/google-oauth-redirect",
        element: <OAuth2Element/>
    },
    {
      path: "/profile", 
      element: <Profile></Profile>,
    }
  ]
},
])
