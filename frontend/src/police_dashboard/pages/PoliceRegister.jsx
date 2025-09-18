import React, { useState, useEffect } from 'react';

// Function to fetch QR data from backend
const getQRData = async () => {
  try {
    const response = await fetch('http://localhost:3000/get-qr-data', {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to fetch QR data');
    }
  } catch (error) {
    console.error('Error fetching QR data:', error);
    throw error;
  }
};

const initialState = {
  fullname: '',
  service_id: '',
  rank: '',
  phone_no: '',
  station: '',
  email: '',
  password: '',
  place_of_posting: '',
  district: '',
  state: ''
};

export default function PoliceRegister() {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [qrData, setQRData] = useState({ foreignQRData: null, domesticQRData: null });

  // Fetch QR data when component mounts
  useEffect(() => {
    const fetchQRData = async () => {
      try {
        const data = await getQRData();
        setQRData(data);
      } catch (error) {
        console.error('Error fetching QR data:', error);
      }
    };
    fetchQRData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await fetch('http://localhost:3000/police/registerpolice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Registration successful!');
        setForm(initialState);
      } else {
        setError(data.errors ? data.errors.map(e => e.msg).join(', ') : data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Police Registration</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(initialState).map((key) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>{key.replace(/_/g, ' ').toUpperCase()}</label>
            <input
              type={key === 'password' ? 'password' : 'text'}
              name={key}
              value={form[key]}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </div>
        ))}
        <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4 }}>
          Register
        </button>
      </form>
      {message && <div style={{ color: 'green', marginTop: 16 }}>{message}</div>}
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}

      {/* QR Code Display */}
      {(qrData.foreignQRData || qrData.domesticQRData) && (
        <div style={{ marginTop: 20 }}>
          <h3>QR Code</h3>
          <img
            src={qrData.foreignQRData || qrData.domesticQRData}
            alt="QR Code"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      )}
    </div>
  );
}
