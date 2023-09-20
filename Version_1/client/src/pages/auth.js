import { useState } from "react";
import axios from 'axios';

// Import hooks for managing cookies and navigation
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

/**
 * Main authentication component comprising both Login and Register forms.
 */
export const Auth = () => {
    return (
        <div className="auth">
            <Login />
            <Register />
        </div>
    );
}

/**
 * Component to handle user login.
 */
const Login = () => {
    // State to manage login form fields
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Hook to set and get cookies; primarily used for the access token
    const [, setCookies] = useCookies(["access_token"]);

    // Hook to navigate between routes programmatically
    const navigate = useNavigate();

    /**
     * Handler function for login form submission.
     */
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            // Authenticate the user with the backend
            const response = await axios.post("http://localhost:3001/auth/login", {
                username,
                password,
            });

            // Save the access token in a cookie upon successful authentication
            setCookies("access_token", response.data.token);

            // Store the user's ID in local storage for later retrieval
            window.localStorage.setItem("userID", response.data.userID);

            // Navigate the user to the homepage after successful login
            navigate("/");
        } catch(err) {
            alert("An error occurred during Login.");
            console.error(err);
        }
    }

    // Render the Form component tailored for login
    return (
        <Form 
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            label="Login"
            onSubmit={onSubmit}
        />
    );
}

/**
 * Component to handle user registration.
 */
const Register = () => {
    // State to manage registration form fields
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    /**
     * Handler function for registration form submission.
     */
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            // Register the user with the backend
            await axios.post("http://localhost:3001/auth/register", {
                username,
                password,
            });
            alert("Registration completed! You can now log in.");
        } catch (err) {
            alert("An error occurred during registration.");
            console.error(err);
        }
    }

    // Render the Form component tailored for registration
    return (
        <Form 
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            label="Register"
            onSubmit={onSubmit}
        />
    );
}

/**
 * Reusable Form component to cater to both Login and Registration.
 */
const Form = ({
    username,
    setUsername,
    password,
    setPassword,
    label,
    onSubmit
}) => {
    return (
        <div className="auth-container">
            <form onSubmit={onSubmit}>
                <h2>{label}</h2>
                
                {/* Input field for username */}
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>
                
                {/* Input field for password */}
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                
                {/* Submit button. Label (Login/Register) is determined by the parent component */}
                <button type="submit">{label}</button>
            </form>
        </div>
    );
}
