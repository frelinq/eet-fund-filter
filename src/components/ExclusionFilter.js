import React, { useState } from 'react';

const ExclusionFilter = ({ exclusionOptions = [], onExclusionsChange }) => {
  // Separat state för valda exkluderingar
  const [selectedExclusions, setSelectedExclusions] = useState([]);

  // När en checkbox ändras (kryssas i eller ur)
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    let updatedExclusions = [...selectedExclusions];

    if (checked) {
      // Lägg till exkluderingen om den inte redan är vald
      if (!updatedExclusions.includes(value)) {
        updatedExclusions.push(value);
      }
    } else {
      // Ta bort exkluderingen från listan, men behåll alla alternativ synliga
      updatedExclusions = updatedExclusions.filter((item) => item !== value);
    }

    console.log('Valda exkluderingar:', updatedExclusions);
    setSelectedExclusions(updatedExclusions); // Uppdatera lokalt state
    onExclusionsChange(updatedExclusions); // Skicka uppdaterad lista till föräldrakomponenten
  };

  // Format för att göra namnen mer läsbara
  const formatExclusionLabel = (exclusion) => {
    return exclusion
      .replace('eet_', '')              // Ta bort 'eet_'
      .replace('_exclusion', '')        // Ta bort '_exclusion'
      .replace('_', ' ')                // Byt ut underscores mot mellanslag
      .replace(/\b\w/g, (c) => c.toUpperCase()); // Kapitalisera första bokstaven i varje ord
  };

  return (
    <div className="exclusion-filter">
      <h3>Exkluderingar</h3>
      {exclusionOptions.length === 0 ? (
        <p>Inga exkluderingsalternativ tillgängliga.</p>
      ) : (
        // Mappa igenom alla valbara exkluderingsalternativ och visa dem
        exclusionOptions.map((option, index) => (
          <label key={index}>
            <input
              type="checkbox"
              value={option}
              checked={selectedExclusions.includes(option)} // Kontrollera om checkboxen är markerad
              onChange={handleCheckboxChange} // Hantera markerad eller avmarkerad status
            />
            {formatExclusionLabel(option)} {/* Visa ett formaterat etikett */}
          </label>
        ))
      )}
    </div>
  );
};

export default ExclusionFilter;
