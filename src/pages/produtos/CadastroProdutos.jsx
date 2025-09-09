import React, { useState, useEffect } from "react";
import api from "../../config/api";

function CadastroProduto() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("success");

  const token = localStorage.getItem("token");

  // Se quiser buscar do backend futuramente
  useEffect(() => {
    // Aqui poderíamos chamar a API de categorias, mas como é enum fixo, definimos direto
    setCategorias(["MOVEIS", "DECORACAO", "ELETRONICOS"]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");

    try {
      await api.post(
        "http://localhost:8601/api/produtos/",
        {
          nomeProduto: nome,
          precoUnitario: parseInt(preco, 10),
          categoria,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensagem("Produto cadastrado com sucesso!");
      setTipoMensagem("success");
      setNome("");
      setPreco("");
      setCategoria("");
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      setMensagem("Erro ao cadastrar produto.");
      setTipoMensagem("danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Cadastro de Produto</h3>
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
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Preço Unitário</label>
                <input
                  type="number"
                  className="form-control"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Categoria</label>
                <select
                  className="form-select"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  required
                >
                  <option value="">Selecione...</option>
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
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

export default CadastroProduto;
