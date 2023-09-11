import { useState } from "react"
import axios from 'axios'

// Importing necessary hooks
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'

// The main authentication component which includes Login and Register forms
export const Auth = () => {
    return (
        <div className="auth">
            <Login />
            <Register />
        </div>
    )
}

const Login = () => {
    // Local state for managing form fields
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    // Hook to manage cookies, specifically to set the access token
    const [ , setCookies] = useCookies(["access_token"])

    // Hook for programmatic navigation
    const navigate = useNavigate()

    // Handler for login submission
    const onSubmit = async (event) => {
        event.preventDefault()
        try {
            // Sending the login credentials to the API for validation
            const response = await axios.post("http://localhost:3001/auth/login", {
                username,
                password,
            })

            // On successful login, set the access token in a cookie
            setCookies("access_token", response.data.token)

            // Also store the user's ID in local storage for quick access
            window.localStorage.setItem("userID", response.data.userID)

            // Redirect the user to the homepage after successful login
            navigate("/")

        } catch(err) {
            alert("An error has occurred during Login")
            console.error(err)
        }
    }

    // Render the Form component with specific props for login
    return (<Form 
        username={username} 
        setUsername={setUsername} 
        password={password} 
        setPassword={setPassword} 
        label="Login"
        onSubmit={onSubmit}
    />)
}

const Register = () => {
    // Local state for managing form fields
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    // Handler for registration submission
    const onSubmit = async (event) => {
        event.preventDefault()
        try {
            // Sending registration data to the API
            await axios.post("http://localhost:3001/auth/register", {
                username,
                password,
            })
            alert("Registration Completed! Now Login.")
        } catch (err) {
            alert("An error has occurred during registration")
            console.error(err)
        }
    }

    // Render the Form component with specific props for registration
    return (<Form 
        username={username} 
        setUsername={setUsername} 
        password={password} 
        setPassword={setPassword}
        label="Register"
        onSubmit={onSubmit}
    />)
}

// A generic Form component to be used for both Login and Register
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
                <h2> {label} </h2>
                {/* Username field */}
                <div className="form-group">
                    <label htmlFor="username"> Username: </label>
                    <input
                         type="text" 
                         id="username"
                         value={username}
                         onChange={(event) => setUsername(event.target.value)}
                    />
                </div>
                {/* Password field */}
                <div className="form-group">
                    <label htmlFor="password"> Password: </label>
                    <input 
                        type="password"
                        id="password" 
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                {/* Submit button with dynamic label based on the form's purpose (Login/Register) */}
                <button type="submit"> {label} </button>
            </form>
        </div>
    )
}
