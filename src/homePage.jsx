import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import SearchLine from './search';
import PokemonCards from './cardSystem';
import PokemonPage from './IndividualPokemonPage';
import './Assets/styles/homePage.css';

function App() {
  return (
    <Router>
      <div id="homePage">
        <SearchLine />
        <Routes>
          <Route path="/" element={<PokemonCards />} />
          <Route path="/pokemon/:id" element={<PokemonPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
