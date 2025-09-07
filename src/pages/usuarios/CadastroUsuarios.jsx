import React, { useState, useEffect } from "react";
import api from "../../config/api";

function CadastroUsuario() {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [nomeAmigavel, setNomeAmigavel] = useState("");
  const [nomeUser, setNomeUser] = useState("");
  const [senha, setSenha] = useState("");
  const [perfis, setPerfis] = useState([]);
  const [todosPerfis, setTodosPerfis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("success");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPerfis = async () => {
      try {
        const response = await api.get("http://localhost:8601/perfis/listar", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodosPerfis(response.data);
      } catch (error) {
        console.error("Erro ao buscar perfis:", error);
      }
    };
    fetchPerfis();
  }, [token]);

  const handleCheckboxChange = (perfil) => {
    if (perfis.includes(perfil)) {
      setPerfis(perfis.filter((p) => p !== perfil));
    } else {
      setPerfis([...perfis, perfil]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");

    try {
        var usuario = {nomeCompleto, nomeAmigavel, nomeUser, senha};
      await api.post(
        "http://localhost:8601/usuarios/cadastrar",
        { usuario, perfis },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensagem("Usuário cadastrado com sucesso!");
      setTipoMensagem("success");
      setNomeCompleto("");
      setNomeAmigavel("");
      setNomeUser("");
      setSenha("");
      setPerfis([]);
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      setMensagem("Erro ao cadastrar usuário.");
      setTipoMensagem("danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Cadastro de Usuário</h3>
        </div>
        <div className="card-body">
          {mensagem && (
            <div className={`alert alert-${tipoMensagem}`} role="alert">
              {mensagem}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nome Completo</label>
                <input
                  type="text"
                  className="form-control"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Nome Amigável</label>
                <input
                  type="text"
                  className="form-control"
                  value={nomeAmigavel}
                  onChange={(e) => setNomeAmigavel(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Nome de Usuário</label>
                <input
                  type="text"
                  className="form-control"
                  value={nomeUser}
                  onChange={(e) => setNomeUser(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Senha</label>
                <input
                  type="password"
                  className="form-control"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label">Perfis</label>
                <div
                  className="border rounded p-2"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {todosPerfis.map((perfil) => (
                    <div className="form-check" key={perfil.id}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`perfil-${perfil.id}`}
                        checked={perfis.includes(perfil)}
                        onChange={() => handleCheckboxChange(perfil)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`perfil-${perfil.id}`}
                      >
                        {perfil.nome}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Cadastrar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CadastroUsuario;
