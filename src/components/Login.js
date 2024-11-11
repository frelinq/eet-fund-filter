// Login.js
import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();
    // En enkel autentisering, här skulle du kunna lägga in en mer säker lösning
    if (username === 'fredrik' && password === 'Iet89lsc') {
      onLogin(true); // Sätt autentisering till sann
    } else {
      alert('Felaktigt användarnamn eller lösenord');
    }
  };

  return (
    <div className="login">
      <h2>Logga in</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Användarnamn:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Lösenord:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Logga in</button>
      </form>
    </div>
  );
};

export default Login;
