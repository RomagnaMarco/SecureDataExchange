import React, { useState, useEffect } from "react";
import axios from "axios";

// Import hooks for managing cookies and navigation
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

/**
 * Main authentication component comprising both Login and Register forms.
 */
export const Auth = () => {
  // Initialize state to track whether to show the registration form
  const [showRegistration, setShowRegistration] = useState(false);

  return (
    <div className="auth">
      {/* Show either Login or Register form based on the state */}
      {showRegistration ? (
        <Register toggleForm={() => setShowRegistration(false)} />
      ) : (
        <Login toggleForm={() => setShowRegistration(true)} />
      )}
    </div>
  );
};

/**
 * Component to handle user login.
 */
const Login = ({ toggleForm }) => {
  // State to manage login form fields and error message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Add error state

  // Hook to set and get cookies; primarily used for the access token
  const [, setCookies] = useCookies(["access_token"]);

  // Hook to navigate between routes programmatically
  const navigate = useNavigate();

  /**
   * Handler function for login form submission.
   */
  const handleLogin = async (event) => {
    event.preventDefault();
  
    // Check if both username and password are entered
    if (!username || !password) {
      alert("Please enter both a username and a password.");
      return;
    }
  
    try {
      // Authenticate the user with the backend (replace with your API endpoint)
      const response = await axios.post("http://localhost:3001/auth/login", {
        username,
        password,
      });
  
      // Check if a token was received in the response
      if (response.data.token) {
        // Save the access token in a cookie upon successful authentication
        setCookies("access_token", response.data.token);
  
        // Store the user's ID in local storage for later retrieval
        window.localStorage.setItem("userID", response.data.userID);
  
        // Navigate the user to the homepage after successful login
        navigate("/");
      } else {
        // Handle the case where the token is missing or invalid
        alert("Token is missing or invalid.");
      }
    } catch (err) {
      alert("An error occurred during Login.");
      console.error(err);
    }
  };
  
  

  // Render the Form component tailored for login
  return (
    <div>
      <Form
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        label="Login"
        onSubmit={handleLogin}
      />
      {/* Display error message */}
      {error && <p>{error}</p>}
      {/* Button to switch to the Register form */}
      <button onClick={toggleForm}>Don't Have an Account? Click Here to Register</button>
    </div>
  );
};

/**
 * Component to handle user registration.
 */
const Register = ({ toggleForm }) => {
  // State to manage registration form fields and error message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Add error state

  /**
   * Handler function for registration form submission.
   */
  const handleRegister = async (event) => {
    event.preventDefault();

    // Check if both username and password are entered
    if (!username || !password) {
      setError("Please enter both a username and password.");
      return;
    }

    try {
      // Register the user with the backend (replace with your API endpoint)
      await axios.post("http://localhost:3001/auth/register", {
        username,
        password,
      });
      alert("Registration completed! You can now log in.");
    } catch (err) {
      setError("An error occurred during registration.");
      console.error(err);
    }
  };

  // Render the Form component tailored for registration
  return (
    <div>
      <Form
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        label="Register"
        onSubmit={handleRegister}
      />
      {/* Display error message */}
      {error && <p>{error}</p>}
      {/* Button to switch to the Login form */}
      <button onClick={toggleForm}>Already Have an account? Click Here to Login</button>
    </div>
  );
};

/**
 * Reusable Form component to cater to both Login and Registration.
 */
const Form = ({
  username,
  setUsername,
  password,
  setPassword,
  label,
  onSubmit,
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
};
