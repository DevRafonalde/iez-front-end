import React, { useState } from "react";
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ListaClientes from './pages/clientes/ListaClientes';
import ListaUsuarios from './pages/usuarios/ListaUsuarios';
import Perfis from './pages/Perfis';
import Permissoes from './pages/Permissoes';
import Login from './pages/login/Login';
import CadastroUsuario from "./pages/usuarios/CadastroUsuarios";
import { useAxiosInterceptor } from "./config/useAxiosInterceptor";
import EditarUsuario from "./pages/usuarios/EdicaoUsuarios";
import CadastroCliente from "./pages/clientes/CadastroClientes";
import EditarCliente from "./pages/clientes/EdicaoClientes";
import ListaProdutos from "./pages/produtos/ListaProdutos";
import CadastroProduto from "./pages/produtos/CadastroProdutos";
import EditarProduto from "./pages/produtos/EdicaoProdutos";
import ListaVendas from "./pages/vendas/ListaVendas";
import CadastroVenda from "./pages/vendas/CadastroVendas";
import EditarVenda from "./pages/vendas/EdicaoVendas";

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
                <Route path="/clientes" element={<ListaClientes />} />
                <Route path="/clientes/cadastrar" element={<CadastroCliente />} />
                <Route path="/clientes/editar/:id" element={<EditarCliente />} />
                <Route path="/produtos" element={<ListaProdutos />} />
                <Route path="/produtos/cadastrar" element={<CadastroProduto />} />
                <Route path="/produtos/editar/:id" element={<EditarProduto />} />
                <Route path="/vendas" element={<ListaVendas />} />
                <Route path="/vendas/cadastrar" element={<CadastroVenda />} />
                <Route path="/vendas/editar/:id" element={<EditarVenda />} />
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
