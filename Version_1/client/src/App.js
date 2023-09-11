import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Home } from './pages/home';
import { SavedData } from './pages/saved-data';
import { AddData } from './pages/add-data';
import { Auth } from './pages/auth';


function App() {
  return (
    <div className="App"> 
        <Router>
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

export default App;