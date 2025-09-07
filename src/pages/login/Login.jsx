import React, { useState } from "react";
import api from "../../config/api";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function Login({ onLogin }) {
  const [nomeUser, setNomeUser] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("http://localhost:8601/usuarios/login", {
        nomeUser,
        senha,
      });

      // supondo que a API retorna { token: "..." }
      localStorage.setItem("token", response.data.token);

      onLogin(); // avisa o App que o usuário autenticou
      navigate("/"); // redireciona para home (pode mudar se quiser)
    } catch (err) {
      console.error("Erro ao logar:", err);
      setError("Usuário ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Usuário</label>
            <input
              type="text"
              className="form-control"
              value={nomeUser}
              onChange={(e) => setNomeUser(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-control"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;