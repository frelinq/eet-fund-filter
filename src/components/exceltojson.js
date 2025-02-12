import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelToJsonFrontend = () => {
    const [jsonData, setJsonData] = useState(null);
    const [fileName, setFileName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [summary, setSummary] = useState(null);

    const getUpdatedSummary = (data) => {
        if (!data || data.length === 0) return null;

        const providers = [
            'Folksam', 'Futur Pension', 'Länsförsäkringar', 'Movestic', 'SEB', 'Skandia', 'SPP', "MP"
        ];

        const providerCounts = providers.reduce((counts, provider) => {
            counts[provider] = data.filter(row => row['bolag'] === provider).length;
            return counts;
        }, {});

        const uniqueISINs = new Set(data.map(row => row['isin'])).size;

        const totalFunds = data.length;

        return { providerCounts, uniqueISINs, totalFunds };
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setFileName(file.name);
        setIsLoading(true);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                const json = XLSX.utils.sheet_to_json(sheet, { defval: null });
                setJsonData(json);

                const updatedSummary = getUpdatedSummary(json);
                setSummary(updatedSummary);
            } catch (error) {
                console.error("Ett fel inträffade vid konverteringen:", error.message);
            } finally {
                setIsLoading(false);
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const downloadJson = () => {
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName.split('.')[0] || 'data'}.json`;
        link.click();
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Excel till JSON Konverterare</h1>
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                style={{ marginBottom: '20px', display: 'block' }}
            />
            {isLoading && (
                <div style={{ marginBottom: '10px' }}>
                    <p>Bearbetar filen...</p>
                </div>
            )}
            {fileName && <p>Uppladdad fil: <strong>{fileName}</strong></p>}
            {summary && (
                <div style={{ marginTop: '10px' }}>
                    <h2>Filens Sammanfattning:</h2>
                    <ul>
                        <li><strong>Totalt antal fonder</strong> {summary.totalFunds}</li>
                        {Object.entries(summary.providerCounts).map(([provider, count]) => (
                            <li key={provider}><strong>Antal fonder {provider}:</strong> {count}</li>
                        ))}
                        <li><strong>Unika ISIN-koder:</strong> {summary.uniqueISINs}</li>
                    </ul>
                    <button
                        onClick={downloadJson}
                        style={{
                            marginTop: '10px',
                            padding: '10px 15px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Ladda ner JSON
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExcelToJsonFrontend;
