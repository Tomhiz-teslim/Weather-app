import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';

import search_icon from '../assets/search.svg';
import wind_icon from '../assets/wind.svg';
import humidity_icon from '../assets/humidity.svg';

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);

  const search = async (city) => {
    if (city === '') {
      alert('Enter City Name');
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      const flag = `https://flagsapi.com/${data.sys.country}/flat/32.png`;

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
        description: data.weather[0].description,
        country: data.sys.country,
        flag: flag,
      });
    } catch (error) {
      setWeatherData(null);
      console.error('Error in fetching weather data:', error);
    }
  };

  useEffect(() => {
    search('Lagos');
  }, []);

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const city = inputRef.current.value.trim();
              if (city) search(city);
            }
          }}
        />
        <img
          src={search_icon}
          alt="Search"
          onClick={() => {
            const city = inputRef.current.value.trim();
            if (city) search(city);
          }}
          className="search"
        />
      </div>

      {weatherData && (
        <>
          <img src={weatherData.icon} alt="Weather Icon" className="weather-icon" />
          <p className="temprature">{weatherData.temperature}°c</p>
          <p className="description" style={{ textTransform: 'capitalize' }}>
            {weatherData.description}
          </p>
          <p className="location">
            {weatherData.location}, {weatherData.country}{' '}
            <img src={weatherData.flag} alt="Flag" style={{ verticalAlign: 'middle' }} />
          </p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="Humidity" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="Wind" />
              <div>
                <p>{weatherData.windSpeed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
