import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import './Assets/styles/page.css'

function PokemonPage() {
  const { id } = useParams();
  const [pokemonData, setPokemonData] = useState(null);
  const [showOfficialArtwork, setShowOfficialArtwork] = useState(true);

  useEffect(() => {
    fetchPokemonData();
  }, []);

  const fetchPokemonData = async () => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      setPokemonData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleArtwork = () => {
    setShowOfficialArtwork(!showOfficialArtwork);
  };

  const renderPokemonDetails = () => {
    if (!pokemonData) {
      return <p>Loading...</p>;
    }

    const artworkUrl = showOfficialArtwork
      ? pokemonData.sprites.other['official-artwork'].front_default
      : pokemonData.sprites.front_default;

    return (
      <div className="pokemon-details">
        <img src={artworkUrl} alt={pokemonData.name} />
        <p className="artwork-toggle" onClick={toggleArtwork}>
          Показати {showOfficialArtwork ? 'піксель-арт' : 'офіційний арт'}
        </p>
        <p><strong>Ім'я:</strong> {pokemonData.name}</p>
        <p><strong>ID:</strong> {pokemonData.id}</p>
        <p><strong>Вага:</strong> {pokemonData.weight}</p>
        <p><strong>Ріст:</strong> {pokemonData.height}</p>
        <p><strong>Тип:</strong> {pokemonData.types.map((type) => type.type.name).join(', ')}</p>
        <p><strong>Способності:</strong> {pokemonData.abilities.map((ability) => ability.ability.name).join(', ')}</p>
      </div>
    );
  };

  return (
    <div className="pokemon-page">
      <Link to="/" className="back-link">&larr; Назад</Link>
      <h2 className="page-title">Деталі покемона</h2>
      {renderPokemonDetails()}
    </div>
  );
}

export default PokemonPage;
