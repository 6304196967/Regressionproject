import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [locations, setLocations] = useState([]);
  const [sqft, setSqft] = useState(1000);
  const [bhk, setBhk] = useState(2);
  const [bath, setBath] = useState(2);
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState(null);

  useEffect(() => {
    fetch("https://rbackend-zp68.onrender.com/get_location_names")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

  const handleEstimate = () => {
    fetch("https://rbackend-zp68.onrender.com/predict_price", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, sqft, bhk, bath }),
    })
      .then((res) => res.json())
      .then((data) => setPrice(data.estimated_price))
      .catch((err) => console.error("Error fetching price:", err));
  };

  return (
    <div className="container">
      <h1>House Price Predictor</h1>
      <div className="form-group">
        <label>Select Location:</label>
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">Select Location</option>
          {locations.map((loc, index) => (
            <option key={index} value={loc}>{loc}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>AREA(Square Feet):</label>
        <input type="number" value={sqft} onChange={(e) => setSqft(e.target.value)} />
      </div>
      <div className="form-group">
        <label>No.of Bedrooms:</label>
        <input type="number" value={bhk} onChange={(e) => setBhk(e.target.value)} />
      </div>
      <div className="form-group">
        <label>No.of Bathrooms:</label>
        <input type="number" value={bath} onChange={(e) => setBath(e.target.value)} />
      </div>
      <button onClick={handleEstimate}>Estimate Price</button>
      {price !== null && <h2 className="result">Estimated Price: ₹{price} Lakhs</h2>}
    </div>
  );
};

export default App;
