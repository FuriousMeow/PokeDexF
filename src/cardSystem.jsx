import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Assets/styles/cards.css';
import { Pagination } from '@material-ui/lab';
import { Link } from 'react-router-dom';

function PokemonCards() {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);
  const [cardsPerPage, setCardsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    fetchPokemonData();
  }, [cardsPerPage, currentPage]);

  useEffect(() => {
    filterPokemonByType();
  }, [selectedTypes, pokemonList]);

  const fetchPokemonData = async () => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon`, {
        params: {
          limit: cardsPerPage,
          offset: (currentPage - 1) * cardsPerPage
        }
      });
      const results = response.data.results;
      const pokemonData = await Promise.all(
        results.map(async (result) => {
          const pokemonResponse = await axios.get(result.url);
          return pokemonResponse.data;
        })
      );
      setPokemonList(pokemonData);
      setTotalPages(Math.ceil(response.data.count / cardsPerPage));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCardsPerPageChange = (e) => {
    setCardsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const filterPokemonByType = () => {
    if (selectedTypes.length === 0) {
      setFilteredPokemonList(pokemonList);
    } else {
      const filteredPokemon = pokemonList.filter((pokemon) => {
        const types = pokemon.types.map((type) => type.type.name);
        return selectedTypes.every((type) => types.includes(type));
      });
      setFilteredPokemonList(filteredPokemon);
    }
  };

  const renderCheckboxRows = () => {
    const types = [
      'normal',
      'fire',
      'water',
      'electric',
      'grass',
      'ice',
      'fighting',
      'ground',
      'flying',
      'psychic',
      'bug',
      'rock',
      'ghost',
      'dragon',
      'dark',
      'steel',
      'fairy'
    ];

    const toggleCheckbox = (type) => {
      const index = selectedTypes.indexOf(type);
      if (index !== -1) {
        setSelectedTypes((prevState) => [...prevState.slice(0, index), ...prevState.slice(index + 1)]);
      } else {
        setSelectedTypes((prevState) => [...prevState, type]);
      }
    };

    return (
      <details key="checkbox-details">
        <summary>Фільтрація по типу</summary>
        <div className="checkbox-container">
          {types.map((type) => (
            <label key={type}>
              <input
                type="checkbox"
                value={type}
                checked={selectedTypes.includes(type)}
                onChange={handleTypeChange}
              />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>
      </details>
    );
  };

  return (
    <div className="pokemon-cards-container">
      <div className="options-container">
        <label htmlFor="cardsPerPage">Кількість карток:</label>
        <select id="cardsPerPage" value={cardsPerPage} onChange={handleCardsPerPageChange}>
          <option value="20">20</option>
          <option value="40">40</option>
          <option value="60">60</option>
        </select>
      </div>
      {renderCheckboxRows()}
      <div className="pokemon-card-container">
        {filteredPokemonList.map((pokemon) => (
          <Link key={pokemon.id} to={`/pokemon/${pokemon.id}`} className="pokemon-card">
            <img src={pokemon.sprites.other['official-artwork'].front_default} alt={pokemon.name} />
            <p>Ім'я: {pokemon.name}</p>
            <p>ID: {pokemon.id}</p>
          </Link>
        ))}
      </div>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        shape="rounded"
        className="pagination"
      />
    </div>
  );
}

export default PokemonCards;
