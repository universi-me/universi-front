import { useContext } from "react";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Singin from "../singin/Singin";


export default function Profile() {
  const authContext = useContext(AuthContext);

  if (authContext.user == null) {
    return <Singin></Singin>
  }
  return (
    <>
      <h1>Pagina de perfil {authContext.user?.name}</h1>
      <button type="button" onClick={authContext.signout}>
        sair
      </button>
    </>
  ) as Element | any;
}
