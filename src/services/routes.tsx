import { QuizPage } from "@/pages/Quiz";
import { App } from "@/src/App";
import GroupPage from "@/pages/Group";
import {ProfilePage} from "@/pages/Profile";
import { About } from "@/pages/About";

import {Navigate, createBrowserRouter} from 'react-router-dom'
import Singin from "../../src/pages/singin/Singin";

import { OAuth2Element }  from './oauth2-google';

import CapacityPage from "@/pages/Capacity/Capacity";
import CategoryPage from "@/pages/Capacity/Category";
import VideoPage from "@/pages/Capacity/VideoPlayer";
import PlaylistPage from "@/pages/Capacity/Playlist";
import ManagerCapacity from "@/pages/Capacity/ManagerCapacity";
import SignUpPage from "@/pages/SignUp";
import ManageProfilePage from "@/pages/ManageProfile";




export const router = createBrowserRouter([{
  path: "/",
  element: <App/>,
  //todo: errorElement: Erro404page,
  children: [
    {
      path: "/",
      element: <Navigate to="/login" />
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
      path: "/capacitacao/gerenciador", 
      element: <ManagerCapacity/>
    },
    {
      path: "/quiz/:id",
      element: <QuizPage />
    },
    {
      path: "/sobre",
      element: <About />
    },
    { path: "/profile/:id", element: <ProfilePage /> },
    { path: "/manage-profile", element: <ManageProfilePage /> },
    { path: "/group/*", element: <GroupPage /> },
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
      path: "/signup",
      element: <SignUpPage/>
    },
    {
        path: "/google-oauth-redirect",
        element: <OAuth2Element/>
    },
  
  ]
},
])
