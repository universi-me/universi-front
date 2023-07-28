import { QuizPage } from "@/pages/Quiz";
import { App } from "@/src/App";
import GroupPage from "@/pages/Group";
import {ProfilePage} from "@/pages/Profile";

import {createBrowserRouter} from 'react-router-dom'
import Singin from "../../src/pages/singin/Singin";

import { OAuth2Element }  from './oauth2-google';

import CapacityPage from "@/pages/Capacity/Capacity";
import CategoryPage from "@/pages/Capacity/Category";
import VideoPage from "@/pages/Capacity/VideoPlayer";
import PlaylistPage from "@/pages/Capacity/Playlist";




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
      path: "/capacitacao/",
      element: <CapacityPage />
    },
    {
      path: "/capacitacao/categoria/:category",
      element: <CategoryPage />
    },
    {
      path: "/capacitacao/play/:videoId",
      element: <VideoPage />
    },
    {
      path: "/capacitacao/playlist/:playlist",
      element: <PlaylistPage />
    },
    {
      path: "/quiz/:id",
      element: <QuizPage />
    },
    { path: "/profile/:id", element: <ProfilePage /> },
    { path: "/group/:id", element: <GroupPage /> },
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
  
  ]
},
])
