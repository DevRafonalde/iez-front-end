import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import api from "../../config/api";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

function ListaVendas() {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get("http://localhost:8601/api/vendas/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setVendas(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar vendas:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta venda?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`http://localhost:8601/api/vendas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendas(vendas.filter((v) => v.id !== id));
    } catch (error) {
      console.error("Erro ao deletar venda:", error);
      alert("Erro ao deletar venda.");
    }
  };

  const colunas = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Data",
      selector: (row) => row.dataVenda,
      sortable: true,
    },
    {
      name: "Cliente",
      selector: (row) => row.cliente?.nome,
      sortable: true,
    },
    {
      name: "Produto",
      selector: (row) => row.produto?.nomeProduto,
      sortable: true,
    },
    {
      name: "Quantidade",
      selector: (row) => row.quantidade,
      sortable: true,
    },
    {
      name: "Total (R$)",
      selector: (row) => row.totalVenda.toFixed(2),
      sortable: true,
    },
    {
      name: "Ações",
      cell: (row) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => navigate(`/vendas/editar/${row.id}`)}
          >
            <FaEdit />
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDelete(row.id)}
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div
        className="mb-4"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 className="text-xl font-bold">Lista de Vendas</h2>
        <Link
          to="/vendas/cadastrar"
          className="btn btn-primary px-4 py-2 rounded"
        >
          Nova Venda
        </Link>
      </div>

      <DataTable
        columns={colunas}
        data={vendas}
        progressPending={loading}
        pagination
      />
    </div>
  );
}

export default ListaVendas;
