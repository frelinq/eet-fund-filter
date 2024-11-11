import React, { useState, useEffect } from 'react';

const EETPopup = ({ fund, onClose, allDataPoints }) => {
  const [searchTerm, setSearchTerm] = useState('');  // Sökfältets state

  // useEffect för att logga varje gång searchTerm uppdateras
  useEffect(() => {
    console.log("EETPopup renderas. searchTerm:", searchTerm);
  }, [searchTerm]);

  // Hantera ändringar i sökfältet
  const handleSearchChange = (event) => {
    console.log("Ändring i sökfältet:", event.target.value);
    setSearchTerm(event.target.value);
  };
  

  // Filtrera EET-datapunkter baserat på sökfältet
  const filteredDataPoints = allDataPoints.filter((dataPoint) =>
    dataPoint.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dataPoint.field.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>EET-data för {fund.fond}</h2>
        <button onClick={onClose}>Stäng</button>
        
        {/* Sökfält för filtrering */}
        <input type="text" placeholder="Sök EET-data..." value={searchTerm} onChange={handleSearchChange}/>
       

        {/* Lista med filtrerad EET-data */}
        <ul>
          {filteredDataPoints.length > 0 ? (
            filteredDataPoints.map((dataPoint, index) => (
              <li key={index}>
                <strong>{dataPoint.label}</strong>: {fund[dataPoint.field] || 'N/A'}
              </li>
            ))
          ) : (
            <li>Inga resultat matchar din sökning</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default EETPopup;
