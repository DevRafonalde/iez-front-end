import React, { useState } from "react";
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Faqs from './pages/Faqs';
import About from './pages/About';
import Usuarios from './pages/Usuarios';
import Perfis from './pages/Perfis';
import Permissoes from './pages/Permissoes';
import Login from './pages/Login';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  
  return (
    <div className="d-flex flex-column min-vh-100">
      {isAuthenticated ? (
        <><Header /><main className="flex-fill">
          <div className="container py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/faqs" element={<Faqs />} />
              <Route path="/about" element={<About />} />
              <Route path="/controle-de-usuarios/usuarios" element={<Usuarios />} />
              <Route path="/controle-de-usuarios/perfis" element={<Perfis />} />
              <Route path="/controle-de-usuarios/permissoes" element={<Permissoes />} />
            </Routes>
          </div>
        </main><Footer /></>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
