import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddSchool from './components/AddSchool';
import ShowSchools from './components/ShowSchools';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="container">
            <h1>School Management System</h1>
            <div className="nav-links">
              <Link to="/">Add School</Link>
              <Link to="/schools">View Schools</Link>
            </div>
          </div>
        </nav>
        
        <div className="container">
          <Routes>
            <Route path="/" element={<AddSchool />} />
            <Route path="/schools" element={<ShowSchools />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;