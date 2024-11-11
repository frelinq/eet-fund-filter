import React, { useState, useEffect } from 'react';

// FundSelection Component
const FundSelection = ({ fundData, onSelectPlatform }) => {
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    // Extrahera unika bolag från fonddata
    const uniquePlatforms = [...new Set(fundData.map((fund) => fund.bolag))];
    setPlatforms(uniquePlatforms);
  }, [fundData]);

  const handleSelectionChange = (event) => {
    onSelectPlatform(event.target.value);
  };

  return (
    <div className="fund-selection">
      <label htmlFor="platform-select">Välj fondutbud:</label>
      <select id="platform-select" onChange={handleSelectionChange}>
        <option value="">Alla</option>
        {platforms.map((platform, index) => (
          <option key={index} value={platform}>
            {platform}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FundSelection;
