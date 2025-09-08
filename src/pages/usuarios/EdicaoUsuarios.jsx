import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/api";

function EditarUsuario() {
  const { id } = useParams(); // id do usuário na URL
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [nomeAmigavel, setNomeAmigavel] = useState("");
  const [nomeUser, setNomeUser] = useState("");
  const [perfisUsuario, setPerfisUsuario] = useState([]);
  const [todosPerfis, setTodosPerfis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("success");

  const token = localStorage.getItem("token");

  // Buscar todos os perfis do banco
  useEffect(() => {
    const fetchPerfis = async () => {
      try {
        const response = await api.get("/perfis/listar", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodosPerfis(response.data); // array de objetos { id, nome }
      } catch (error) {
        console.error("Erro ao buscar perfis:", error);
      }
    };
    fetchPerfis();
  }, [token]);

  // Buscar dados do usuário para preencher o formulário
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await api.get(`/usuarios/listar-especifico/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const resposta = response.data;
        setNomeCompleto(resposta.usuario.nomeCompleto);
        setNomeAmigavel(resposta.usuario.nomeAmigavel);
        setNomeUser(resposta.usuario.nomeUser);
        setPerfisUsuario(resposta.perfisUsuario || []); // array de IDs ou objetos conforme a API
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        setMensagem("Erro ao carregar dados do usuário.");
        setTipoMensagem("danger");
      }
    };
    fetchUsuario();
  }, [id, token]);

  const handleCheckboxChange = (perfil) => {
    if (perfisUsuario.includes(perfil.id)) {
      setPerfisUsuario(perfisUsuario.filter((p) => p !== perfil.id));
    } else {
      setPerfisUsuario([...perfisUsuario, perfil.id]);
    }
  };

  const possuiPerfil = (perfil) => {
    for (let i = 0; i < perfisUsuario.length; i++) {
      if (perfisUsuario[i].id === perfil.id) {
        return true;
      }
    }
    return false;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");

    try {
      const usuarioAtualizado = {
        id,
        nomeCompleto,
        nomeAmigavel,
        nomeUser,
      };

      await api.put(
        `/usuarios/editar`,
        { usuario: usuarioAtualizado, perfisUsuario },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensagem("Usuário atualizado com sucesso!");
      setTipoMensagem("success");
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      setMensagem("Erro ao atualizar usuário.");
      setTipoMensagem("danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Editar Usuário</h3>
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
                        checked={possuiPerfil(perfil)}
                        onChange={() => handleCheckboxChange(perfil)}
                      />
                      {console.log(perfil)}
                      {console.log(perfisUsuario.includes(perfil))}
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
                {loading ? "Atualizando..." : "Atualizar Usuário"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarUsuario;
