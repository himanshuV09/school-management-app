import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShowSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/schools');
      setSchools(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching schools:', error);
      setError('Failed to load schools. Please make sure the backend server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="no-schools">Loading schools...</div>;
  }

  if (error) {
    return (
      <div className="no-schools">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={fetchSchools} className="submit-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="form-title">All Schools</h2>

      {schools.length === 0 ? (
        <div className="no-schools">
          <h3>No schools found</h3>
          <p>Add some schools using the "Add School" form to get started.</p>
        </div>
      ) : (
        <>
          <p className="school-count">Showing {schools.length} school(s)</p>
          <div className="schools-grid">
            {schools.map((school) => (
              <div key={school.id} className="school-card">
                <img
                  src={school.imageUrl}
                  alt={school.name}
                  className="school-image"
                />
                <div className="school-info">
                  <h3 className="school-name">{school.name}</h3>
                  <p className="school-details">{school.address}</p>
                  <p className="school-details">{school.city}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ShowSchools;