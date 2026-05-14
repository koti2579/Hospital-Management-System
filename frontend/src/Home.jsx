import React from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import './App.css';

function App() {
    return (
       <div className="home-container">
        <Navbar />
        <main className="main-content">
            <Home />
        </main>
       </div>
    );
};

export default App;