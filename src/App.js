import React from 'react';
import './App.css';
import Bracket from './components/Bracket';
import backgroundImage from './assets/background.jpg';
import trophyImage from './assets/trophy.png';

function App() {
  return (
    <main className="App" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <header className="app-header">
        <div className="header-container">
          <div className="header-brand">
            <img src={trophyImage} alt="UEFA Champions League Trophy" className="header-logo" />
            <h1 className="header-title">Bracket Predictor</h1>
          </div>
        </div>
      </header>

      <Bracket />

      <footer className="app-footer">
        <div className="footer-container">
          <span className="footer-text">Desarrollado por Juan Rojas</span>
          <a 
            href="https://github.com/JuanRoj" 
            target="_blank" 
            rel="noreferrer" 
            aria-label="GitHub de Juan Rojas"
            className="footer-link"
          >
            <svg viewBox="0 0 24 24" className="github-icon">
              <path d="M12 0.5C5.65 0.5 0.5 5.65 0.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.03c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.29-1.68-1.29-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.11-.75.41-1.26.74-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18.92-.26 1.91-.38 2.89-.39.98.01 1.97.13 2.89.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.39-5.25 5.67.42.36.79 1.07.79 2.15v3.04c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
          </a>
        </div>
      </footer>
    </main>
  );
}

export default App;
