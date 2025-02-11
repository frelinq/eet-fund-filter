import React, { useState, useEffect } from 'react';

const AdminSettings = ({ allDataPoints = [], onSaveSettings, initialSettings }) => {
  const [environmentPoints, setEnvironmentPoints] = useState(initialSettings.environment || []);
  const [environmentPolutionPoints, setEnvironmentPolutionPoints] = useState(initialSettings.environmentPolution || []);
  const [socialPoints, setSocialPoints] = useState(initialSettings.social || []);
  const [governancePoints, setGovernancePoints] = useState(initialSettings.governance || []);
  const [exclusionPoints, setExclusionPoints] = useState(initialSettings.exclusions || []);

// Ny state för automatisk exkludering av fonder med "Söderberg" i namnet
const [autoExcludeSoderberg, setAutoExcludeSoderberg] = useState(true);

  useEffect(() => {
    setEnvironmentPoints(initialSettings.environment || []);
    setEnvironmentPolutionPoints(initialSettings.environmentPolution || []);
    setSocialPoints(initialSettings.social || []);
    setGovernancePoints(initialSettings.governance || []);
    setExclusionPoints(initialSettings.exclusions || []);
  }, [initialSettings]);

  const handleCheckboxChange = (categorySetter, currentCategory, dataPoint) => (event) => {
    const isChecked = event.target.checked;
    let updatedCategory = [...currentCategory];

    if (isChecked) {
      updatedCategory.push(dataPoint);
    } else {
      updatedCategory = updatedCategory.filter((item) => item !== dataPoint);
    }

    categorySetter(updatedCategory);
  };

  const handleSaveSettings = () => {
    onSaveSettings({
      environment: environmentPoints,
      environmentPolution: environmentPolutionPoints,
      social: socialPoints,
      governance: governancePoints,
      exclusions: exclusionPoints,
      autoExcludeSoderberg, // Lägg till denna rad
    });
};

  const environmentOptions = [
    { label: 'Koldioxidavtryck (Scope 1, 2, 3)', field: 'eet_carbon_footprint_scope_1_2_and_3_considered' },
    { label: 'Växthusgaser (Total)', field: 'eet_ghg_emissions_total_scope_1_2_and_3_considered' },
    { label: 'Exponering mot fossila bränslen', field: 'eet_exposure_to_fossil_fuel_sector_considered' }
  ];

  const environmentPolutionOptions = [
    { label: 'Utsläpp till vatten', field: 'eet_water_emissions_considered' },
    { label: 'Farligt avall', field: 'eet_hazardous_waste_ratio_considered' },
    { label: 'Negativ påverkan på biologisk mångfald', field: 'eet_negative_affect_on_biodiversity_considered' }
  ];

  const socialOptions = [
    { label: 'Löneskillnader mellan könen', field: 'eet_unadjusted_gender_pay_gap_considered' },
    { label: 'Avsaknad av mänskliga rättigheter', field: 'eet_lacking_human_right_policy_considered' },
   // tar bort  { label: 'Kontroversiella vapen', field: 'eet_controversial_weapons_considered'}
  ];

  const governanceOptions = [
    { label: 'Könsfördelning i styrelsen', field: 'eet_board_gender_diversity_considered' },
    { label: 'Brott mot FN:s Global Compact-principer', field: 'eet_united_nations_global_compact_principles_or_oecd_guidelines_violations_considered' }
  ];

  const exclusionOptions = allDataPoints;

  return (
    <div className="admin-settings">
      <h3>Admin Inställningar för Datapunkter</h3>

      <div className="data-point-categories">
        <div className="category">
          <h4 className="tooltip-container">
            Miljö
            <span className="tooltip">
              <ul>
                {environmentOptions.map((option) => (
                  <li key={option.field}>{option.label} ({option.field})</li>
                ))}
              </ul>
            </span>
          </h4>
          <p>För att räknas som miljömässigt hållbar måste fonden ha ett "Y" på samtliga ikryssade fält nedan</p>
          {environmentOptions.map((option, index) => (
            <label key={index}>
              <input
                type="checkbox"
                checked={environmentPoints.includes(option.field)}  // Kontrollera baserat på field
                onChange={handleCheckboxChange(setEnvironmentPoints, environmentPoints, option.field)} // Skicka endast field
              />
              {option.label}
            </label>
          ))}
        </div>

        <div className="category">
          <h4 className="tooltip-container">
            Miljö 2
            <span className="tooltip">
              <ul>
                {environmentPolutionOptions.map((option) => (
                  <li key={option.field}>{option.label} ({option.field})</li>
                ))}
              </ul>
            </span>
          </h4>
          <p>För att räknas som miljömässigt hållbar måste fonden ha ett "Y" på samtliga ikryssade fält nedan</p>
          {environmentPolutionOptions.map((option, index) => (
            <label key={index}>
              <input
                type="checkbox"
                checked={environmentPolutionPoints.includes(option.field)}
                onChange={handleCheckboxChange(setEnvironmentPolutionPoints, environmentPolutionPoints, option.field)}
                />
                {option.label}
            </label>
          ))}
        </div>

        <div className="category">
          <h4 className="tooltip-container">
            Socialt ansvar
            <span className="tooltip">
              <ul>
                {socialOptions.map((option) => (
                  <li key={option.field}>{option.label} ({option.field})</li>
                ))}
              </ul>
            </span>
          </h4>
          <p>För att räknas som socialt hållbar måste fonden ha ett "Y" på samtliga ikryssade fält nedan</p>
          {socialOptions.map((option, index) => (
            <label key={index}>
              <input
                type="checkbox"
                checked={socialPoints.includes(option.field)}  // Kontrollera baserat på field
                onChange={handleCheckboxChange(setSocialPoints, socialPoints, option.field)} // Skicka endast field
              />
              {option.label}
            </label>
          ))}
        </div>

        <div className="category">
          <h4 className="tooltip-container">
            Bolagsstyrning
            <span className="tooltip">
              <ul>
                {governanceOptions.map((option) => (
                  <li key={option.field}>{option.label} ({option.field})</li>
                ))}
              </ul>
            </span>
          </h4>
          <p>För att räknas som en fond med hållbar bolagsstyrning måste fonden ha ett "Y" på samtliga ikryssade fält nedan</p>
          {governanceOptions.map((option, index) => (
            <label key={index}>
              <input
                type="checkbox"
                checked={governancePoints.includes(option.field)}  // Kontrollera baserat på field
                onChange={handleCheckboxChange(setGovernancePoints, governancePoints, option.field)} // Skicka endast field
              />
              {option.label}
            </label>
          ))}
        </div>

        <div className="category">
          <h4>Exkluderingar</h4>
          {exclusionOptions.map((dataPoint, index) => (
            <label key={index}>
              <input
                type="checkbox"
                checked={exclusionPoints.includes(dataPoint.label)}  // Kontrollera baserat på label
                onChange={handleCheckboxChange(setExclusionPoints, exclusionPoints, dataPoint.label)} // Skicka endast label
              />
              {dataPoint.label}
            </label>
          ))}
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={autoExcludeSoderberg}
              onChange={() => setAutoExcludeSoderberg(!autoExcludeSoderberg)}
             // disabled // Gör så att inställningen inte kan avmarkeras
            />
            Automatiskt exkludera fonder med "Söderberg" i namnet
          </label>
        </div>
      
      </div>

      <button onClick={handleSaveSettings}>Spara Inställningar</button>
    </div>
  );
};

export default AdminSettings;
