import React, { useState } from "react";
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Faqs from './pages/Faqs';
import About from './pages/About';
import ListaUsuarios from './pages/usuarios/ListaUsuarios';
import Perfis from './pages/Perfis';
import Permissoes from './pages/Permissoes';
import Login from './pages/login/Login';
import CadastroUsuario from "./pages/usuarios/CadastroUsuarios";
import { useAxiosInterceptor } from "./config/useAxiosInterceptor";
import EditarUsuario from "./pages/usuarios/EdicaoUsuarios";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  useAxiosInterceptor(setIsAuthenticated);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {isAuthenticated ? (
        <>
          <Header />
          <main className="flex-fill">
            <div className="container py-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/faqs" element={<Faqs />} />
                <Route path="/about" element={<About />} />
                <Route path="/controle-de-usuarios/usuarios" element={<ListaUsuarios />} />
                <Route path="/controle-de-usuarios/usuarios/cadastrar" element={<CadastroUsuario />} />
                <Route path="/controle-de-usuarios/usuarios/:id/editar" element={<EditarUsuario />} />
                <Route path="/controle-de-usuarios/perfis" element={<Perfis />} />
                <Route path="/controle-de-usuarios/permissoes" element={<Permissoes />} />
              </Routes>
            </div>
          </main>
          <Footer />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
