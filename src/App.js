import React from 'react';
import './App.css';
import Bracket from './components/Bracket';
import backgroundImage from './assets/background.jpg';

function App() {
  return (
    <div className="App" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <h1>Winner Bracket UEFA Champions League</h1>
      <Bracket />
    </div>
  );
}

export default App;