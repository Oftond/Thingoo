import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateListingPage from './pages/CreateListing/CreateListingPage';
import CatalogPage from './pages/Catalog/CatalogPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/create" element={<CreateListingPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;