import React, { useState } from "react";
import axios from "axios";
import zxcvbn from "zxcvbn"; // Library for password strength checking

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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      setError("Please enter both a username and a password.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        username,
        password,
      });

      if (response.data.token) {
        setCookies("access_token", response.data.token);
        window.localStorage.setItem("userID", response.data.userID);
        navigate("/");
      } else {
        setError(<span style={{ color: 'red' }}>Invalid credentials. Please try again.</span>);
      }
    } catch (err) {
      setError("An error occurred during Login.");
      console.error(err);
    }
  };

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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // State to store the password strength score
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);

    // Check password strength and update the score
    const result = zxcvbn(newPassword);
    setPasswordStrength(result.score);
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      setError("Please enter both a username and password.");
      return;
    }

    if (passwordStrength < 3) {
      setError("Please choose a stronger password.");
      return;
    }

    try {
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

  return (
    <div>
      <Form
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={handlePasswordChange}
        label="Register"
        onSubmit={handleRegister}
      />
      {/* Display error message */}
      {error && <p>{error}</p>}
      <div>
        Password Strength:{" "}
        <span style={{ color: getPasswordStrengthColor(passwordStrength) }}>
          {getPasswordStrengthTextWithColor(passwordStrength)}
        </span>
      </div>
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
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={setPassword} // Use the provided setPassword function
          />
        </div>
        <button type="submit">{label}</button>
      </form>
    </div>
  );
};

// Function to determine the color based on password strength
const getPasswordStrengthColor = (strength) => {
  switch (strength) {
    case 0:
      return "red"; // Weakest password
    case 1:
      return "orange"; // Not very strong
    case 2:
      return "yellow"; // Moderate strength
    case 3:
      return "green"; // Strong password
    case 4:
      return "darkgreen"; // Very strong password
    default:
      return "black"; // Default color for unknown strength
  }
};

// Function to get text representation of password strength
const getPasswordStrengthTextWithColor = (strength) => {
  const strengthText = getPasswordStrengthText(strength);
  const color = getPasswordStrengthColor(strength);
  return <span style={{ color }}>{strengthText}</span>;
};

// Function to get text representation of password strength
const getPasswordStrengthText = (strength) => {
  switch (strength) {
    case 0:
      return "Weak";
    case 1:
      return "Fair";
    case 2:
      return "Good";
    case 3:
      return "Strong";
    case 4:
      return "Very Strong";
    default:
      return "Unknown";
  }
};
