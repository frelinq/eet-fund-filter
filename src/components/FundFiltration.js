import React, { useState, useEffect } from 'react';
import FundSelection from './FundSelection';
import EETSlider from './EETSlider';
import SustainabilityPreferences from './SustainabilityPreferences';
import ExclusionFilter from './ExclusionFilter';
import fundData from '../data/fundsData.json';

function FundFiltration({ settings, allDataPoints }) {
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [eetThreshold, setEetThreshold] = useState(0);
  const [preferences, setPreferences] = useState({
    environment: false,
    environmentPolution: false,
    social: false,
    governance: false,
  });
  const [availableExclusions, setAvailableExclusions] = useState([]);
  const [selectedExclusions, setSelectedExclusions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  
  const [showFilteredOutFunds, setShowFilteredOutFunds] = useState(false);
  const [filteredOutFundsWithReasons, setFilteredOutFundsWithReasons] = useState([]);
  const [listSearchQuery, setListSearchQuery] = useState(''); // Söktext för fondlistan
  const [modalSearchQuery, setModalSearchQuery] = useState(''); // Söktext för modalen

  useEffect(() => {
    setAvailableExclusions(settings.exclusions || []);
  }, [settings.exclusions]);

  const handlePlatformChange = (platform) => {
    setSelectedPlatform(platform);
  };

  const handleThresholdChange = (threshold) => {
    setEetThreshold(threshold);
  };

  const handlePreferencesChange = (updatedPreferences) => {
    setPreferences(updatedPreferences);
  };

  const handleExclusionsChange = (updatedExclusions) => {
    setSelectedExclusions(updatedExclusions);
  };

  const handleShowDetails = (fund) => {
    setSelectedFund(fund); 
    setShowModal(true); 
    setModalSearchQuery(''); // Återställ söktexten i modalen
  };

  const handleCloseModal = () => {
    setShowModal(false); 
    setSelectedFund(null); 
  };

  const handleShowFilteredOutFunds = () => {
    setShowFilteredOutFunds(!showFilteredOutFunds); 
  };

  const handleListSearchChange = (event) => {
    setListSearchQuery(event.target.value); // Uppdatera söktexten för fondlistan
  };

  const handleModalSearchChange = (event) => {
    setModalSearchQuery(event.target.value); // Uppdatera söktexten för modalen
  };

  const filteredFunds = [];
  const filteredOutFunds = [];

  fundData.forEach((fund) => {
    const reasons = [];
  
    // Automatiskt exkludera fonder med "Söderberg" i fondnamnet
    if (settings.autoExcludeSoderberg && fund.fond.includes('Söderberg')) {
      reasons.push('Fonden innehåller "Söderberg" i namnet');
      filteredOutFunds.push({ fund, reasons }); 
      return;
    }

    const meetsPlatformCriteria = selectedPlatform ? fund.bolag === selectedPlatform : true;
    if (!meetsPlatformCriteria) reasons.push('Fondutbud matchar inte');
  
    const meetsEetCriteria = fund.eet_sfdr_last_reported_investments_are_sustainable_investments >= eetThreshold;
    if (!meetsEetCriteria) reasons.push('EET-värdet är för lågt');
  
    const meetsEnvironmentCriteria = !preferences.environment || (
      settings.environment.every((envField) => fund[envField] === 'Y')
    );
    if (!meetsEnvironmentCriteria) reasons.push('Miljö-kriterier matchar inte');
  
    const meetsEnvironmentPolutionCriteria = !preferences.environmentPolution || (
      (settings.environmentPolution || []).every((envPolField) => fund[envPolField] === 'Y')
    );
    if (!meetsEnvironmentPolutionCriteria) reasons.push('Miljöförorening-kriterier matchar inte');
  
    const meetsSocialCriteria = !preferences.social || (
      settings.social.every((socField) => fund[socField] === 'Y')
    );
    if (!meetsSocialCriteria) reasons.push('Sociala kriterier matchar inte');
  
    const meetsGovernanceCriteria = !preferences.governance || (
      settings.governance.every((govField) => fund[govField] === 'Y')
    );
    if (!meetsGovernanceCriteria) reasons.push('Bolagsstyrning-kriterier matchar inte');
  
    const exclusionFieldsMap = settings.exclusions.reduce((map, exclusion) => {
      const exclusionField = allDataPoints.find((dp) => dp.label === exclusion);
      if (exclusionField) {
        map[exclusionField.label] = exclusionField.field;
      }
      return map;
    }, {});
  
    const meetsExclusionCriteria = selectedExclusions.every((exclusion) => {
      const field = exclusionFieldsMap[exclusion];
      return fund[field] === 'Y';
    });
    if (!meetsExclusionCriteria) reasons.push('Exkluderingskriterier matchar inte');
  
    if (
      reasons.length === 0 &&
      meetsPlatformCriteria &&
      meetsEetCriteria &&
      meetsEnvironmentCriteria &&
      meetsEnvironmentPolutionCriteria &&
      meetsSocialCriteria &&
      meetsGovernanceCriteria &&
      meetsExclusionCriteria
    ) {
      filteredFunds.push(fund);
    } else {
      filteredOutFunds.push({ fund, reasons });
    }
  });

  // Filtrera fonder baserat på söktext för fondlistan
  const displayedFunds = filteredFunds.filter((fund) => 
    fund.fond.toLowerCase().includes(listSearchQuery.toLowerCase())
  );

  useEffect(() => {
    setFilteredOutFundsWithReasons(filteredOutFunds);
  }, [filteredOutFunds]);

  return (
    <div>
      <h1>Fondfiltrering</h1>
      <FundSelection fundData={fundData} onSelectPlatform={handlePlatformChange} />
      <EETSlider onThresholdChange={handleThresholdChange} />
      <SustainabilityPreferences onPreferencesChange={handlePreferencesChange} savedSettings={settings} />
      <ExclusionFilter exclusionOptions={availableExclusions} onExclusionsChange={handleExclusionsChange} />

      {/* Sökfält för fondlistan */}
      <input 
        type="text" 
        placeholder="Sök fondnamn..." 
        value={listSearchQuery} 
        onChange={handleListSearchChange} 
        className="search-fund-input"
      />

      <p>{displayedFunds.length} av {fundData.length} fonder är valbara med dessa inställningar</p>
      <h2>Fonder som matchar:</h2>
      <table>
        <thead>
          <tr>
            <th>Utbud</th>
            <th>Fondnamn</th>
            <th>ISIN</th>
            <th>Visa detaljer</th>
          </tr>
        </thead>
        <tbody>
          {displayedFunds.map((fund, index) => (
            <tr key={index}>
              <td>{fund.bolag}</td>
              <td>{fund.fond}</td>
              <td>{fund.isin}</td>
              <td>
                <button onClick={() => handleShowDetails(fund)}>Visa detaljer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleShowFilteredOutFunds}>
        {showFilteredOutFunds ? 'Dölj bortfiltrerade fonder' : 'Visa bortfiltrerade fonder'}
      </button>

      {showFilteredOutFunds && (
        <div>
          <h2>Bortfiltrerade fonder</h2>
          <table>
            <thead>
              <tr>
                <th>Utbud</th>
                <th>Fondnamn</th>
                <th>ISIN</th>
                <th>Anledning(ar) till bortfiltrering</th>
                <th>Visa detaljer</th>
              </tr>
            </thead>
            <tbody>
              {filteredOutFundsWithReasons.map(({ fund, reasons }, index) => (
                <tr key={index}>
                  <td>{fund.bolag}</td>
                  <td>{fund.fond}</td>
                  <td>{fund.isin}</td>
                  <td>{reasons.join(', ')}</td>
                  <td>
                    <button onClick={() => handleShowDetails(fund)}>Visa detaljer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedFund && (
        <div className="modal">
          <div className="modal-header"> 
            <h2>Fonddata för {selectedFund.fond}</h2>
            <button className="close-btn" onClick={handleCloseModal}>Stäng</button>
          </div>
          <div className="modal-search">
            <input 
              className="search-input" 
              type="text" 
              placeholder="Sök EET-data..."
              value={modalSearchQuery}
              onChange={handleModalSearchChange}  // Uppdatera söktexten för modalen
            />
          </div>
          <div className="modal-body">
            <ul>
              {Object.entries(selectedFund)
                .filter(([key, value]) =>
                  (key && key.toLowerCase().includes(modalSearchQuery.toLowerCase())) ||
                  (value != null && value.toString().toLowerCase().includes(modalSearchQuery.toLowerCase()))
                )
                .map(([key, value], index) => (
                  <li key={index}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default FundFiltration;
