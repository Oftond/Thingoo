import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleNavigate = (target) => {
    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app">
      <Header
        onNavigate={handleNavigate}
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
      />

      <div className="app-content">
        {page === "home" && <Home />}
        {page === "about" && <AboutUs />}
      </div>

      <Footer />

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} />
      )}

      {showRegister && (
        <RegisterModal onClose={() => setShowRegister(false)} />
      )}
    </div>
  );
}

export default App;
