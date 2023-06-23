import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PokemonCards() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);

  useEffect(() => {
    fetchPokemonList();
  }, []);

  useEffect(() => {
    filterPokemonByType();
  }, [selectedType]);

  const fetchPokemonList = async () => {
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000');
      const results = response.data.results;
      setPokemonList(results);
      setFilteredPokemonList(results);
    } catch (error) {
      console.error(error);
    }
  };

  const filterPokemonByType = () => {
    if (selectedType === 'all') {
      setFilteredPokemonList(pokemonList);
    } else {
      const filteredPokemon = pokemonList.filter(async (pokemon) => {
        const response = await axios.get(pokemon.url);
        const pokemonType = response.data.types[0].type.name;
        return pokemonType === selectedType;
      });
      setFilteredPokemonList(filteredPokemon);
    }
  };

  return (
    <div>
      <h2>Pokemon Type:</h2>
      <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
        <option value="all">All</option>
        <option value="fire">Fire</option>
        <option value="water">Water</option>
        <option value="grass">Grass</option>
        {/* Добавьте другие типы покемонов здесь */}
      </select>

      <div>
        {filteredPokemonList.map((pokemon) => (
          <div key={pokemon.name}>
            <h3>{pokemon.name}</h3>
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} alt={pokemon.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PokemonCards;
