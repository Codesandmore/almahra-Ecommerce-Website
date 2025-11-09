import { useState } from 'react';
import axios from 'axios';

const ApiTest = () => {
  const [status, setStatus] = useState('Click button to test API connection');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Testing connection...');
    
    try {
      const response = await axios.get('http://localhost:5000/health');
      setStatus(`✅ SUCCESS! Backend is connected!\n${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      setStatus(`❌ ERROR: ${error.message}\n${error.response?.data ? JSON.stringify(error.response.data, null, 2) : ''}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '20px',
      margin: '20px',
      border: '2px solid #3498db',
      borderRadius: '10px',
      backgroundColor: '#f8f9fa'
    }}>
      <h2 style={{ color: '#2c3e50' }}>🔌 Backend Connection Test</h2>
      <button
        onClick={testConnection}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {loading ? 'Testing...' : 'Test Backend Connection'}
      </button>
      <pre style={{
        backgroundColor: '#2c3e50',
        color: '#fff',
        padding: '15px',
        borderRadius: '5px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        {status}
      </pre>
    </div>
  );
};

export default ApiTest;
