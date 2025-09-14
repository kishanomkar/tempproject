import React, { useState } from 'react';

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
        setError(data.errors ? data.errors.map(e => e.msg).join(', ') : data);
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
        <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4 }} onClick={() => console.log("pressed")}>Register</button>
      </form>
      {message && <div style={{ color: 'green', marginTop: 16 }}>{message}</div>}
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}

      <img src="data:image/png;base64,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" alt="" />
    </div>
  );
}
