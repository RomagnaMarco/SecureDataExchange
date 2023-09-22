import React, { useState } from "react";
import axios from "axios";
import zxcvbn from "zxcvbn"; // Library for password strength checking

// Import hooks for managing cookies and navigation
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

/**
 * Main authentication component comprising both Login and Register forms.
 * This component toggles between the Login and Registration forms.
 */
export const Auth = () => {
  const [showRegistration, setShowRegistration] = useState(false);

  return (
    <div className="auth">
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
      if (err.response && err.response.status === 401) {
        setError(<span style={{ color: 'red' }}>Authentication failed. Please check your credentials.</span>);
      } else if (err.response && err.response.status === 500) {
        setError(<span style={{ color: 'red' }}>An internal server error occurred. Please try again later.</span>);
      } else {
        setError(`An error occurred during Login. Please try again.`);
        console.error(err);
      }
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div>
      <Form
        username={username}
        setUsername={setUsername}
        password={password}
        onPasswordChange={handlePasswordChange}
        label="Login"
        onSubmit={handleLogin}
      />
      {error && <p>{error}</p>}
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
  const [passwordStrength, setPasswordStrength] = useState(0);

  // This handler not only updates the password state 
  // but also determines its strength score using the `zxcvbn` library.
  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
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
      setError("");  // Clear any previous error messages
    } catch (err) {
      console.error("Registration error:", err);  // Log the error for debugging
  
      if (err.response) {
        if (err.response.status === 409) {
          setError(err.response.data.message);
        } else if (err.response.status === 500) {
          setError("An internal server error occurred. Please try again later.");
        } else {
          setError("An error occurred during registration. Please try again.");
        }
      } else {
        setError("Unable to connect to the server. Please try again.");
      }
    }
  };
  

  return (
    <div>
      <Form
        username={username}
        setUsername={setUsername}
        password={password}
        onPasswordChange={handlePasswordChange}
        label="Register"
        onSubmit={handleRegister}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        Password Strength: 
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
 * This component abstracts the form structure, reducing redundancy.
 */
const Form = ({
  username,
  setUsername,
  password,
  onPasswordChange,
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
            onChange={onPasswordChange}
          />
        </div>
        <button type="submit">{label}</button>
      </form>
    </div>
  );
};

/**
 * Determines the color to represent the strength of the password.
 * This function uses the score (from 0 to 4) given by the `zxcvbn` library.
 */
const getPasswordStrengthColor = (strength) => {
  switch (strength) {
    case 0:
      return "red";
    case 1:
      return "orange";
    case 2:
      return "yellow";
    case 3:
      return "green";
    case 4:
      return "darkgreen";
    default:
      return "black";
  }
};

/**
 * Retrieves the textual representation of the password's strength.
 * This function is essentially wrapping `getPasswordStrengthText` and
 * can be considered redundant in the current context. One might decide 
 * to use this function if they want to add more styling or representations
 * besides just color in the future.
 */
const getPasswordStrengthTextWithColor = (strength) => {
  const strengthText = getPasswordStrengthText(strength);
  return strengthText;
};

/**
 * Converts the numerical strength score (from 0 to 4) into a descriptive string.
 * The score is determined by the `zxcvbn` library.
 */
const getPasswordStrengthText = (strength) => {
  switch (strength) {
    case 0:
      return "Very Weak";
    case 1:
      return "Weak";
    case 2:
      return "Moderate";
    case 3:
      return "Strong";
    case 4:
      return "Very Strong";
    default:
      return "Unknown";
  }
};
