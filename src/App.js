import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import FundFiltration from './components/FundFiltration'; 
import AdminSettings from './components/AdminSettings'; 
import Login from './components/Login'; // Importera Login-komponenten
import './App.css';
import ExcelToJsonFrontend from './components/exceltojson';

const defaultSettings = {
  environment: [
    'eet_carbon_footprint_scope_1_2_and_3_considered',
    'eet_ghg_emissions_total_scope_1_2_and_3_considered',
    'eet_exposure_to_fossil_fuel_sector_considered'
  ],
  environmentPolution: [
    'eet_water_emissions_considered',
    'eet_hazardous_waste_ratio_considered',
    'eet_negative_affect_on_biodiversity_considered'
  ],
  social: [
    'eet_unadjusted_gender_pay_gap_considered',
    'eet_lacking_human_right_policy_considered',
    'eet_controversial_weapons_considered'
  ],
  governance: [
    'eet_board_gender_diversity_considered',
    'eet_united_nations_global_compact_principles_or_oecd_guidelines_violations_considered'
  ],
  exclusions: [
    //'Pornografi',
    'Alkohol',
    'Kol',
    'Olja',
    'Tobak',
    'Kärnvapen',
    'Konventionella vapen',
    'Cannabis',
    'Okonventionella vapen',
    'Kommersiell spelverksamhet',
    'Palmolja',
  ]
};

function App() {
  // Hantera inloggningsstatus
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  // State-hantering för applikationsinställningar
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('savedSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const allDataPoints = [
    { label: 'Alkohol', field: 'eet_alcohol_exclusion' },
    { label: 'Kol', field: 'eet_coal_exclusion' },
    { label: 'Olja', field: 'eet_oil_exclusion' },
    { label: 'Tobak', field: 'eet_tobacco_exclusion' },
    { label: 'Kärnvapen', field: 'eet_nuclear_weapons_exclusion'},
    { label: 'Konventionella vapen', field: 'eet_conventional_weapons_exclusion' },
   // { label: 'Pornografi', field: 'eet_pornography_adult_entertainment_services_exclusion' },
    { label: 'Cannabis', field: 'eet_cannabis_exclusion' },
    { label: 'Okonventionella vapen', field: 'eet_unconventional_weapons_exclusion'},
    { label: 'Kommersiell spelverksamhet', field: 'eet_gambling_exclusion'},
    { label: 'Palmolja', field: 'eet_palm_oil_exclusion'}
  ];

  console.log('All Data Points:', allDataPoints);

  // Funktion för hantering av inloggning
  const handleLogin = (status) => {
    setIsAuthenticated(status);
    if (status) {
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('isAuthenticated');
    }
  };

  // Funktion för hantering av utloggning
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated'); // Ta bort inloggningsstatus från localStorage
  };

  const handleSaveSettings = (updatedSettings) => {
    setSettings(updatedSettings);
    localStorage.setItem('savedSettings', JSON.stringify(updatedSettings));
  };

  useEffect(() => {
    const saved = localStorage.getItem('savedSettings');
    if (saved) {
      const parsedSettings = JSON.parse(saved);
      console.log('Loaded settings from localstorage:', parsedSettings);
      setSettings(parsedSettings);
    } else {
      console.log('Using default settings:', defaultSettings);
      localStorage.setItem('savedSettings', JSON.stringify(defaultSettings));
    }
  }, []);

  // Vid första inladdning, kontrollera om användaren är inloggad
  useEffect(() => {
    const loggedIn = localStorage.getItem('isAuthenticated');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        {isAuthenticated ? (
          <>
            <nav className="top-menu">
              <ul>
                <li><Link to="/">Fondfiltrering</Link></li>
                <li><Link to="/admin">Admininställningar</Link></li>
                <li><Link to="/konvertera">Konvertera</Link></li>
                <li>
                  <button onClick={handleLogout}>Logga ut</button> {/* Utloggningsknapp */}
                </li>
              </ul>
            </nav>

            <div className="content">
              <Routes>
                <Route 
                  path="/" 
                  element={<FundFiltration settings={settings} allDataPoints={allDataPoints} />} 
                />
                <Route 
                  path="/admin" 
                  element={<AdminSettings allDataPoints={allDataPoints} onSaveSettings={handleSaveSettings} initialSettings={settings} />} 
                />
                <Route
                  path="/konvertera"
                  element={<ExcelToJsonFrontend/>}
                />
              </Routes>
            </div>
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
}

export default App;
