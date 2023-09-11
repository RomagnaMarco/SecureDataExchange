import { Link} from 'react-router-dom'
import { useCookies } from "react-cookie"
import { useNavigate } from 'react-router-dom'


export const Navbar = () => {

    const [cookies, setCookies] = useCookies(["access_token"])

    //navigate hook
    const navigate = useNavigate()

    const logout = () => {
        setCookies("access_token", "")
        window.localStorage.removeItem("userID")
        navigate("/auth")
    }

    return (
    <div className ="navbar"> 
    <Link to="/"> Home </Link>{" "}
    <Link to="/add-data"> Add Data </Link>{" "}
    <Link to="/saved-data"> Saved Data </Link>{" "}
    {!cookies.access_token ? (
        <Link to="/auth"> Login/Register </Link>
        ) : (
            <button onClick={logout}> Logout </button>
        )}
    </div>
    )
}