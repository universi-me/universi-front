import { QuizPage } from "@/pages/Quiz";
import { App } from "@/src/App";
import GroupPage, { GroupPageLoader } from "@/pages/Group";
import { ProfilePage, ProfilePageLoader } from "@/pages/Profile";
import { About } from "@/pages/About";
import ManageGroupPage, { ManageGroupLoader } from "@/pages/ManageGroup";

import {Navigate, createBrowserRouter} from 'react-router-dom'
import Singin from "@/pages/singin/Singin";

import { OAuth2Element }  from './oauth2-google';

import CapacityPage from "@/pages/Capacity/Capacity";
import CategoryPage from "@/pages/Capacity/Category";
import VideoPage from "@/pages/Capacity/VideoPlayer";
import FolderPage from "@/pages/Capacity/Folder";
import ManagerCapacity from "@/pages/Capacity/ManagerCapacity";
import SignUpPage from "@/pages/SignUp";
import Recovery  from "@/pages/Recovery/Recovery";
import NewPassword from "@/pages/NewPassword/NewPassword";
import ManageProfilePage, { ManageProfileLoader } from "@/pages/ManageProfile";




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
      path: "/capacitacao/folder/:folderId",
      element: <FolderPage />
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
    { path: "/profile/:id", element: <ProfilePage />, loader: ProfilePageLoader },
    { path: "/manage-profile", element: <ManageProfilePage />, loader: ManageProfileLoader },
    { path: "/group/*", element: <GroupPage />, loader: GroupPageLoader },
    { path: "/recovery-password/:id", element: <NewPassword/>},
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
      path: "/recovery",
      element: <Recovery/>
    },
    {
        path: "/google-oauth-redirect",
        element: <OAuth2Element/>
    },
    {
        path: "/manage-group",
        element: <ManageGroupPage />,
        loader: ManageGroupLoader,
    },
  ]
},
])

export function goTo(pathname: string) {
  if (!window)
      return;
  const pathnameWithoutSlash = pathname.startsWith('/')? pathname.substring(1) : pathname;
  const destiny = `${window.location.origin}/${pathnameWithoutSlash}`;
  const alreadyThere = location.href === destiny;
  if (!alreadyThere)
      router.navigate(`/${pathnameWithoutSlash}`);
  
}