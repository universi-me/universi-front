import { QuizPage } from "@/pages/Quiz";
import { App } from "@/src/App";
import GroupPage, { GroupPageLoader } from "@/pages/Group";
import { ProfilePage, ProfilePageLoader } from "@/pages/Profile";
import { About } from "@/pages/About";

import { createBrowserRouter } from 'react-router-dom';
import Singin from "@/pages/singin/Singin";

import { OAuth2Element } from './oauth2-google';
import { KeyCloakOAuth2Element } from "./oauth2-keycloak";

import SignUpPage from "@/pages/SignUp";
import Recovery from "@/pages/Recovery/Recovery";
import NewPassword from "@/pages/NewPassword/NewPassword";
import ManageProfilePage, { ManageProfileLoader } from "@/pages/ManageProfile";
import Homepage from "@/pages/Homepage";
import SettingsPage, { GroupEmailFilterPage, GroupEmailFilterLoader, RolesPage, RolesPageLoader, EnvironmentsPage, EnvironmentsLoader, CompetencesSettingsPage, CompetencesSettingsLoader, GroupThemeColorPage} from "@/pages/Settings";
import ContentPage from "@/pages/Content";
import { ContentPageLoader } from "@/pages/Content/ContentPageLoader";
import PageNotFound from "@/pages/PageNotFound/PageNotFound";



export const router = createBrowserRouter([{
  path: "/",
  element: <App/>,
  errorElement: <PageNotFound />,
  children: [
    {
      path: "/",
      element: <Homepage />
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
      path: "/keycloak-oauth-redirect",
      element: <KeyCloakOAuth2Element/>
    },
    {
        path: "/settings",
        element: <SettingsPage />,
        children: [
            {
                path: "email-filter",
                element: <GroupEmailFilterPage />,
                loader: GroupEmailFilterLoader,
            },
            {
                path: "roles",
                element: <RolesPage />,
                loader: RolesPageLoader,
            },
            {
                path: "environments",
                element: <EnvironmentsPage />,
                loader: EnvironmentsLoader,
            },
            {
                path: "competences",
                element: <CompetencesSettingsPage />,
                loader: CompetencesSettingsLoader,
            },
            {
              path:"theme-color",
              element: <GroupThemeColorPage />,
            }
        ],
    },
    {
        path: "/content/:id",
        element: <ContentPage />,
        loader: ContentPageLoader,
    }
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