import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/api";

function EditarProduto() {
  const { id } = useParams(); // pega o id da URL
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("success");

  const token = localStorage.getItem("token");

  useEffect(() => {
    setCategorias(["MOVEIS", "DECORACAO", "ELETRONICOS"]); // enums fixos

    const fetchProduto = async () => {
      try {
        const response = await api.get(
          `http://localhost:8601/api/produtos/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const produto = response.data;
        setNome(produto.nomeProduto);
        setPreco(produto.precoUnitario);
        setCategoria(produto.categoria);
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
        setMensagem("Erro ao carregar produto.");
        setTipoMensagem("danger");
      }
    };

    fetchProduto();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");

    try {
      await api.put(
        `http://localhost:8601/api/produtos/${id}`,
        {
          nomeProduto: nome,
          precoUnitario: parseInt(preco, 10),
          categoria,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensagem("Produto atualizado com sucesso!");
      setTipoMensagem("success");

      // Redireciona após editar (pode ser para lista de produtos, por exemplo)
      setTimeout(() => navigate("/produtos"), 1500);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      setMensagem("Erro ao atualizar produto.");
      setTipoMensagem("danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-warning text-dark">
          <h3 className="mb-0">Editar Produto</h3>
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
                className="btn btn-warning btn-lg"
                disabled={loading}
              >
                {loading ? "Atualizando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarProduto;
