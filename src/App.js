import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Header />
      <div className="app-content">
        <Home />
      </div>
      <Footer />
    </div>
  );
}

export default App;
