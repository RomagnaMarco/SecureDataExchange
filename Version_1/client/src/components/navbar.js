// Importing necessary libraries and hooks for routing, cookie management, and JWT decoding
import { Link } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import jwtDecode from "jwt-decode";
import { useEffect, useState } from 'react';

export const Navbar = () => {
    // Manage the access_token using the useCookies hook
    const [cookies, setCookies] = useCookies(["access_token"]);
    
    // Use the useNavigate hook from react-router for programmatic navigation
    const navigate = useNavigate();
    
    // Using state to manage the clearance level
    const [clearanceLevel, setClearanceLevel] = useState(0);

    useEffect(() => {
        console.log("Navbar is being mounted.");

        // Check for the presence of an access_token and decode it to obtain the user's clearance level
        if (cookies.access_token) {
            const decodedToken = jwtDecode(cookies.access_token);
            setClearanceLevel(decodedToken.clearanceLevel || 0); // Extract clearance level or default to 0
        }

        return () => {
            console.log("Navbar is being unmounted.")
        }
    }, [cookies.access_token]); // Adding dependency to re-run the useEffect when the token changes

    /**
     * Handles the logout process by:
     * 1. Removing the access_token from cookies
     * 2. Deleting the userID from local storage
     * 3. Redirecting the user to the authentication page
     */
    const logout = () => {
        setCookies("access_token", "", { expires: new Date(0) }); // Expire the access_token cookie immediately
        window.localStorage.removeItem("userID"); // Remove userID from local storage
        console.log("About to navigate to /auth");
        navigate("/auth"); // Redirect to the authentication page
    }

    return (
        <div className="navbar">
            {/* Standard link to the home page */}
            <Link to="/"> Home </Link>{" "}
            
            {/* Display certain navigation links based on the user's authentication status and clearance level */}
            {cookies.access_token && (
                <>
                    {/* Show the "Add Data" link only to users with a clearance level of 1 or higher */}
                    {clearanceLevel >= 1 && <Link to="/add-data"> Add Data </Link>}{" "}
                    <Link to="/saved-data"> Saved Data </Link>{" "}
                </>
            )}

            {/* Conditionally display either a "Login/Register" link or a "Logout" button based on the user's authentication status */}
            {!cookies.access_token ? (
                <Link to="/auth"> Login/Register </Link>
            ) : (
                <button onClick={logout}> Logout </button>
            )}
        </div>
    );
}
