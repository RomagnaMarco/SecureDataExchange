import { Link} from 'react-router-dom'


export const Navbar = () => {
    return (
    <div className ="navbar"> 
    <Link to="/"> Home </Link>{" "}
    <Link to="/add-data"> Add Data </Link>{" "}
    <Link to="/saved-data"> Saved Data </Link>{" "}
    <Link to="/auth"> Login/Register </Link>{" "}
    </div>
    )
}