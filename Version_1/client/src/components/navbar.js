
// Importing necessary libraries and hooks for routing, cookie management, and JWT decoding
import { Link } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import jwtDecode from "jwt-decode";

export const Navbar = () => {
    // Manage the access_token using the useCookies hook
    const [cookies, setCookies] = useCookies(["access_token"]);

    // Use the useNavigate hook from react-router for programmatic navigation
    const navigate = useNavigate();

    // Set the default clearance level for a user
    let clearanceLevel = 0;

    // Attempt to decode the JWT token and extract the clearance level
    try {
        // Check for the presence of an access_token
        if (cookies.access_token) {
            // Decode the JWT token to obtain user details
            const decodedToken = jwtDecode(cookies.access_token);
            // Extract clearance level from the decoded token or default to 0
            clearanceLevel = decodedToken.clearanceLevel || 0;
        }
    } catch (error) {
        // In case of an error in decoding (e.g., token is invalid), handle gracefully
        console.error("Error decoding the token:", error);
        // You might want to invalidate the token here and force a re-login
        setCookies("access_token", "", { expires: new Date(0) });
        navigate("/auth");
    }

    /**
     * Handles the logout process by:
     * 1. Removing the access_token from cookies
     * 2. Deleting the userID from local storage
     * 3. Redirecting the user to the authentication page
     */
    const logout = () => {
        // Expire the access_token cookie immediately
        setCookies("access_token", "", { expires: new Date(0) });
        // Remove userID from local storage
        window.localStorage.removeItem("userID");
        // Redirect to the authentication page
        navigate("/auth");
    }

    return (
        <div className="navbar">
            {/* Standard link to the home page */}
            <Link to="/"> Home </Link>{" "}
            
            {/* Conditionally display navigation links based on user's authentication and clearance level */}
            {cookies.access_token && (
                <>
                    {/* Show "Add Data" link only to users with clearance level 1 or higher */}
                    {clearanceLevel >= 1 && <Link to="/add-data"> Add Data </Link>}{" "}
                    <Link to="/saved-data"> Saved Data </Link>{" "}
                </>
            )}

            {/* Conditionally display either "Login/Register" link or "Logout" button based on authentication status */}
            {!cookies.access_token ? (
                <Link to="/auth"> Login/Register </Link>
            ) : (
                <button onClick={logout}> Logout </button>
            )}
        </div>
    );
}
