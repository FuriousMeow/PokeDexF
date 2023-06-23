import React, { useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import './Assets/styles/search.css';

function SearchLine() {
  const [pokemon, setPokemon] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  const handleSearch = async () => {
    if (!pokemon) {
      setError('Спочатку введіть щось!');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
      setSearchResult(response.data);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        try {
          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
          const results = response.data.results;
          const matchingPokemons = results.filter((result) => {
            const pokemonName = result.name.toLowerCase();
            const searchKeyword = pokemon.toLowerCase();
            return pokemonName.includes(searchKeyword);
          });
          if (matchingPokemons.length > 0) {
            const firstMatchingPokemon = matchingPokemons[0];
            const pokemonResponse = await axios.get(firstMatchingPokemon.url);
            setSearchResult(pokemonResponse.data);
          } else {
            setSearchResult(null);
          }
        } catch (error) {
          console.error(error);
          setSearchResult(null);
        }
      } else {
        setSearchResult(null);
      }
    }

    setIsLoading(false);
  };

  // Проверяем, являемся ли находимся на индивидуальной странице покемона
  const isPokemonPage = location.pathname.includes('/pokemon/');

  // Скрываем систему поиска на индивидуальной странице покемона
  if (isPokemonPage) {
    return null;
  }

  return (
    <div id="searchLine">
      <input
        type="text"
        placeholder="Введіть ім'я або Id покемона"
        value={pokemon}
        onChange={(e) => setPokemon(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {isLoading ? (
        <p>Пошук...</p>
      ) : searchResult ? (
        <div id="pokemonSearchDones">
          <Link to={`/pokemon/${searchResult.id}`} className="pokemon-link">
            <h2 id="pokemonName">{searchResult.name}</h2>
            <p id="pokemonId">ID: {searchResult.id}</p>
            <img src={searchResult.sprites.other['official-artwork'].front_default} alt={searchResult.name} />
          </Link>
        </div>
      ) : error ? (
        <p id="error">{error}</p>
      ) : pokemon.length > 0 ? (
        <p id="noPokemonFound">Покемона не знайдено!</p>
      ) : (
        <h2 id="listOfCards">Список карток</h2>
      )}
    </div>
  );
}

export default SearchLine;
