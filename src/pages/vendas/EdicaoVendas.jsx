import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/api";

function EditarVenda() {
  const { id } = useParams(); // 👈 Pega o ID da venda pela URL
  const navigate = useNavigate();

  const [dataVenda, setDataVenda] = useState("");
  const [produto, setProduto] = useState("");
  const [cliente, setCliente] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [totalVenda, setTotalVenda] = useState(0);

  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("success");

  const token = localStorage.getItem("token");

  // Busca os dados da venda
  useEffect(() => {
    const fetchVenda = async () => {
      try {
        const response = await api.get(`http://localhost:8601/api/vendas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const venda = response.data;

        setDataVenda(venda.dataVenda);
        setProduto(venda.produto.id);
        setCliente(venda.cliente.id);
        setQuantidade(venda.quantidade);
        setTotalVenda(venda.totalVenda);
      } catch (error) {
        console.error("Erro ao carregar venda:", error);
        setMensagem("Erro ao carregar venda.");
        setTipoMensagem("danger");
      }
    };

    const fetchAuxiliares = async () => {
      try {
        const resProdutos = await api.get("http://localhost:8601/api/produtos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProdutos(resProdutos.data);

        const resClientes = await api.get("http://localhost:8601/api/clientes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClientes(resClientes.data);
      } catch (error) {
        console.error("Erro ao carregar clientes/produtos:", error);
      }
    };

    fetchVenda();
    fetchAuxiliares();
  }, [id, token]);

  // Atualiza total automaticamente
  useEffect(() => {
    if (produto && quantidade) {
      const prod = produtos.find((p) => p.id === parseInt(produto, 10));
      if (prod) {
        setTotalVenda(prod.precoUnitario * quantidade);
      }
    }
  }, [produto, quantidade, produtos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");

    try {
      await api.put(
        `http://localhost:8601/api/vendas/${id}`,
        {
          id: parseInt(id, 10),
          dataVenda,
          produto: { id: parseInt(produto, 10) },
          cliente: { id: parseInt(cliente, 10) },
          quantidade: parseInt(quantidade, 10),
          totalVenda,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMensagem("Venda atualizada com sucesso!");
      setTipoMensagem("success");

      setTimeout(() => navigate("/vendas"), 1500);
    } catch (error) {
      console.error("Erro ao atualizar venda:", error);
      setMensagem("Erro ao atualizar venda.");
      setTipoMensagem("danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-warning text-dark">
          <h3 className="mb-0">Editar Venda</h3>
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
                <label className="form-label">Data da Venda</label>
                <input
                  type="date"
                  className="form-control"
                  value={dataVenda}
                  onChange={(e) => setDataVenda(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Cliente</label>
                <select
                  className="form-select"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  required
                >
                  <option value="">Selecione...</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Produto</label>
                <select
                  className="form-select"
                  value={produto}
                  onChange={(e) => setProduto(e.target.value)}
                  required
                >
                  <option value="">Selecione...</option>
                  {produtos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nomeProduto} - R$ {p.precoUnitario}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Quantidade</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Total</label>
                <input
                  type="text"
                  className="form-control"
                  value={totalVenda.toFixed(2)}
                  disabled
                />
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

export default EditarVenda;
