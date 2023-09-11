import { useState } from "react"

// The auth component definition
export const Auth = () => {
    return (
    <div className="auth">
         <Login />

         <Register />
    </div>
    )
}

const Login = () => {
    return (
    <div className="auth-container">
        
    </div>
    )
}

const Register = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    return (
    <div className="auth-container">
        <form>
            <h2> Register </h2>
            <div className="form-group">
                <label htmlFor="username"> Username: </label>
                <input
                     type="text" 
                     id="username"
                     value = { username }
                     onChange={(event) => setUsername(event.target.value)}
                     />
            </div>
            <div className="form-group">
                <label htmlFor="password"> Password: </label>
                <input 
                    type="text" //explore type password later
                    id="password" 
                    value={ password }
                    onChange={(event) => setPassword(event.target.value)}
                    />
            </div>
            <button type="submit"> Register </button>
        </form>
    </div>
    )
}
