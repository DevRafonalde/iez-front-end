import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/api";

function EditarCliente() {
  const { id } = useParams(); // id do cliente na URL
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("success");

  const token = localStorage.getItem("token");

  // Buscar dados do cliente para preencher o formulário
  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await api.get(`/clientes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const resposta = response.data;
        setNome(resposta.cliente.nomeCompleto);
      } catch (error) {
        console.error("Erro ao buscar cliente:", error);
        setMensagem("Erro ao carregar dados do cliente.");
        setTipoMensagem("danger");
      }
    };
    fetchCliente();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");

    try {
      await api.put(
        `/clientes/editar`,
        { nome },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensagem("Cliente atualizado com sucesso!");
      setTipoMensagem("success");
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      setMensagem("Erro ao atualizar cliente.");
      setTipoMensagem("danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Editar Cliente</h3>
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
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? "Atualizando..." : "Atualizar Cliente"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarCliente;
