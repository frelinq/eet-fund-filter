import React, { useState } from 'react';

const SustainabilityPreferences = ({ onPreferencesChange, savedSettings }) => {
  const [preferences, setPreferences] = useState({
    environment: false,
    environmentPolution: false,
    social: false,
    governance: false,
  });

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const updatedPreferences = { ...preferences, [name]: checked };
    setPreferences(updatedPreferences);
    onPreferencesChange(updatedPreferences);
  };

  // Generera tooltip-innehåll baserat på de valda inställningarna
  const getTooltipContent = (category) => {
    if (!savedSettings[category] || savedSettings[category].length === 0) {
      return 'Inga datapunkter valda';
    }

    return (
      <ul>
        {savedSettings[category].map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="sustainability-preferences">
      <h3>Hållbarhetspreferenser</h3>

      <label>
        <input
          type="checkbox"
          name="environment"
          checked={preferences.environment}
          onChange={handleCheckboxChange}
        />
        Klimatpåverkan
        <span className="tooltip">
          ⓘ
          <span className="tooltiptext">Följande EET-fält kräver "Y" för att fond ska visas om denna parameter aktiveras{getTooltipContent('environment')}</span>
        </span>
      </label>

      <label>
        <input
          type="checkbox"
          name="environmentPolution"
          checked={preferences.environmentPolution}
          onChange={handleCheckboxChange}
        />
        Miljöpåverkan
        <span className="tooltip">
          ⓘ
          <span className="tooltiptext">Följande EET-fält kräver "Y" för att fond ska visas om denna parameter aktiveras{getTooltipContent('environmentPolution')}</span>
        </span>
      </label>

      <label>
        <input
          type="checkbox"
          name="social"
          checked={preferences.social}
          onChange={handleCheckboxChange}
        />
        Socialt ansvar
        <span className="tooltip">
          ⓘ
          <span className="tooltiptext">Följande EET-fält kräver "Y" för att fond ska visas om denna parameter aktiveras{getTooltipContent('social')}</span>
        </span>
      </label>

      <label>
        <input
          type="checkbox"
          name="governance"
          checked={preferences.governance}
          onChange={handleCheckboxChange}
        />
        Bolagsstyrning
        <span className="tooltip">
          ⓘ
          <span className="tooltiptext">Följande EET-fält kräver "Y" för att fond ska visas om denna parameter aktiveras{getTooltipContent('governance')}</span>
        </span>
      </label>
    </div>
  );
};

export default SustainabilityPreferences;
