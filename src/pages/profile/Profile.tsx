import { useContext } from "react"
import { AuthContext } from "../../contexts/Auth/AuthContext"


export default function Profile() {

    const authContext = useContext(AuthContext)

    return(
        <h1>
            Pagina de perfil {authContext.user?.email}
        </h1>
    )

}