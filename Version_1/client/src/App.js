// Importing styles and component dependencies
import './App.css';

// React Router components for managing in-app navigation and routing
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importing individual page components to be routed
import { Home } from './pages/home';
import { SavedData } from './pages/saved-data';
import { AddData } from './pages/add-data';
import { Auth } from './pages/auth';

// Importing shared Navbar component
import { Navbar } from './components/navbar';

// Main App component which is the root component of the application
function App() {
  return (
    <div className="App">
        {/* Wrapping the entire app inside the Router component to enable routing */}
        <Router>
            {/* Global Navbar component, displayed on all pages */}
            <Navbar />

            {/* Route definitions mapping URL paths to corresponding page components */}
            <Routes>
                <Route path="/" element={<Home />} />              // Home route
                <Route path="/auth" element={<Auth />} />          // Authentication route (Login/Register)
                <Route path="/add-data" element={<AddData />} />   // Route to add new data
                <Route path="/saved-data" element={<SavedData />} /> // Route to view saved data
            </Routes>
        </Router>
    </div>
  );
}

// Export the App component so it can be used as the root component in the application's entry point
export default App;
