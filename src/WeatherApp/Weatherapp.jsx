import { useState } from 'react';
import styles from './Weatherapp.module.css'; // Fixed import path
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, Wind } from 'lucide-react';

function Weatherapp() {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState('');

    const changeHandler = (e) => {
        const value = (e.target.value);
        setCity(value);
        if (!value.trim()) {
            setWeatherData(null);
            setError('');
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (!city.trim()) {
            setError("Please enter a city name.");
            return;
        }

        setError("");

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8d7e29c82499f027d78eca3793421f62&units=metric`)
            .then((res) => res.json())
            .then((data) => {
                if (data.cod !== 200) {
                    setError("City not found. Please try again.");
                    setWeatherData(null);
                } else {
                    setWeatherData({
                        temperature: Math.round(data.main.temp),
                        description: data.weather[0].description,
                        condition: data.weather[0].main
                    });
                    // setCity('');
                }
            })
            .catch(() => {
                setError("Error fetching weather data. Please try again later.");
            });
    };

    const renderWeatherIcon = (condition) => {
        switch (condition.toLowerCase()) {
            case 'clear':
                return <Sun size={50} color="yellow" />;
            case 'clouds':
                return <Cloud size={50} color="lightgray" />;
            case 'rain':
                return <CloudRain size={50} color="blue" />;
            case 'snow':
                return <CloudSnow size={50} color="white" />;
            case 'thunderstorm':
                return <CloudLightning size={50} color="purple" />;
            case 'mist':
            case 'haze':
            case 'fog':
                return <CloudFog size={50} color="gray" />;
            case 'wind':
                return <Wind size={50} stroke="white" />; // Fixed stroke color
            default:
                return <Sun size={50} color="yellow" />;
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>Weather App</h3>
                <form onSubmit={submitHandler} className={styles.form}>
                    <input
                        type="text"
                        name="city"
                        onChange={changeHandler}
                        value={city}
                        placeholder="Enter City Name"
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button}>Get Weather</button>
                </form>
                {error && <p className={styles.error}>{error}</p>}
                {weatherData && (
                    <div className={styles.weatherContainer}>
                        <div className={styles.weatherIconContainer}>
                            {renderWeatherIcon(weatherData.condition)}
                        </div>
                        <p className={styles.weatherText}>
                            <strong>{city}</strong>: {weatherData.temperature}°C
                        </p>
                        <p className={styles.weatherDescription}>{weatherData.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Weatherapp;
