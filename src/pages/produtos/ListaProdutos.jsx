import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import api from "../../config/api";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [produtoParaDeletar, setProdutoParaDeletar] = useState(null); // id do produto
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const response = await api.get("api/produtos/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletarClick = (id) => {
    setProdutoParaDeletar(id);
    setShowModal(true);
  };

  const confirmarDelecao = async () => {
    try {
      await api.delete(`/api/produtos/${produtoParaDeletar}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      setProdutoParaDeletar(null);
      fetchProdutos(); // atualiza a lista
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    }
  };

  const colunas = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Nome do Produto", selector: (row) => row.nomeProduto, sortable: true },
    { name: "Preço Unitário", selector: (row) => row.precoUnitario, sortable: true },
    { name: "Categoria", selector: (row) => row.categoria, sortable: true },
    {
      name: "Ações",
      cell: (row) => (
        <div className="d-flex gap-2">
          <Link
            to={`/produtos/editar/${row.id}`}
            className="btn btn-primary btn-sm"
          >
            <FaEdit />
          </Link>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDeletarClick(row.id)}
          >
            <FaTrash />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h2 className="text-xl font-bold">Lista de Produtos</h2>
        <Link
          to="/produtos/cadastrar"
          className="btn btn-primary px-4 py-2"
        >
          Cadastrar Produto
        </Link>
      </div>

      <DataTable
        columns={colunas}
        data={produtos}
        progressPending={loading}
        pagination
      />

      {/* Modal de confirmação */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmação</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Tem certeza que deseja deletar este produto?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-danger" onClick={confirmarDelecao}>Deletar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListaProdutos;
