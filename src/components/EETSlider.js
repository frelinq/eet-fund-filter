import React, { useState } from 'react';

const EETSlider = ({ onThresholdChange }) => {
  const [threshold, setThreshold] = useState(0);

  const handleSliderChange = (event) => {
    const value = event.target.value;
    setThreshold(value);
    onThresholdChange(value);
  };

  return (
    <div className="eet-slider">
      <label htmlFor="eet-threshold">Filtrera på EET-värde (hållbara investeringar):</label>
      <input
        type="range"
        id="eet-threshold"
        min="0"
        max="100"
        value={threshold}
        onChange={handleSliderChange}
      />
      <span>{threshold}%</span>
    </div>
  );
};

export default EETSlider;
