// Importing necessary libraries and hooks
import { Link } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import jwtDecode from "jwt-decode";  // Import the JWT decoding library

export const Navbar = () => {
    // Using the useCookies hook to manage the access_token cookie
    const [cookies, setCookies] = useCookies(["access_token"]);

    // Using the useNavigate hook from react-router for programmatic navigation
    const navigate = useNavigate();

    let clearanceLevel = 0; // Default clearance level

    // If there's an access_token, decode it to get the clearance level
    if (cookies.access_token) {
        const decodedToken = jwtDecode(cookies.access_token);
        clearanceLevel = decodedToken.clearanceLevel;
    }

    // Logout function: clears the access_token cookie, removes userID from local storage, and navigates to the auth page
    const logout = () => {
        setCookies("access_token", ""); // Clearing the access_token cookie
        window.localStorage.removeItem("userID"); // Removing the userID from local storage
        navigate("/auth"); // Navigating to the auth page
    }

    return (
        <div className="navbar"> 
            {/* Navigation links */}
            <Link to="/"> Home </Link>{" "}
            
            {/* Conditional rendering based on whether the user is logged in (i.e., has an access_token) */}
            {cookies.access_token && (
                <>
                    {clearanceLevel >= 1 && <Link to="/add-data"> Add Data </Link>}{" "}
                    <Link to="/saved-data"> Saved Data </Link>{" "}
                </>
            )}

            {!cookies.access_token ? (
                <Link to="/auth"> Login/Register </Link>
            ) : (
                <button onClick={logout}> Logout </button>
            )}
        </div>
    );
}
