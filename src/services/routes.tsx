import { QuizPage } from "@/pages/Quiz";
import { App } from "@/src/App";
import ProfilePage from "@/pages/Profile";

import {createBrowserRouter} from 'react-router-dom'




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
      path: "/quiz/:id",
      element: <QuizPage />
    },
    { path: "/profile/:id", element: <ProfilePage /> },
    {//identificador unico - dynamic routes
      //path: "perfil/:id",
      //element: <></>
    },
    {//navigate para paginas não existentes - redireciona o caminho de paginas que uma vez existiram, 
     // mas não existem mais, para o caminho novo, certo.
      // path: "caminhoantigo",
      // element: <Navigate to = "/novocaminho"/>

    }
    
  ]
}
])
