import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import api from "../../config/api";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

function ListaClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clienteParaDeletar, setClienteParaDeletar] = useState(null); // id do cliente
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const response = await api.get("api/clientes/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletarClick = (id) => {
    setClienteParaDeletar(id);
    setShowModal(true);
  };

  const confirmarDelecao = async () => {
    try {
      await api.delete(`/api/clientes/${clienteParaDeletar}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      setClienteParaDeletar(null);
      fetchClientes(); // atualiza a lista
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
    }
  };

  const colunas = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Nome", selector: (row) => row.nome, sortable: true },
    {
      name: "Ações",
      cell: (row) => (
        <div className="d-flex gap-2">
          <Link
            to={`/clientes/editar/${row.id}`}
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
        <h2 className="text-xl font-bold">Lista de Clientes</h2>
        <Link
          to="/clientes/cadastrar"
          className="btn btn-primary px-4 py-2"
        >
          Cadastrar Cliente
        </Link>
      </div>

      <DataTable
        columns={colunas}
        data={clientes}
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
                <p>Tem certeza que deseja deletar este cliente?</p>
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

export default ListaClientes;
