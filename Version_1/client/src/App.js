// Importing necessary styles and components
import './App.css';
// React Router imports for setting up routing
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Importing page components
import { Home } from './pages/home';
import { SavedData } from './pages/saved-data';
import { AddData } from './pages/add-data';
import { Auth } from './pages/auth';
import { Navbar } from './components/navbar';

// Main App component
function App() {
  return (
    <div className="App"> 
        {/* Setting up the router */}
        <Router>
          <Navbar />
            {/* Defining routes for the application */}
            <Routes>
                <Route path="/" element={ <Home />} />
                <Route path="/auth" element={ <Auth />} />
                <Route path="/add-data" element={ <AddData />} />
                <Route path="/saved-data" element={ <SavedData />} />
            </Routes>
        </Router>
    </div>
  );
}

// Exporting the App component for use in other parts of the application
export default App;
