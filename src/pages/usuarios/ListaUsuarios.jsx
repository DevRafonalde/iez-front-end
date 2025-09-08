import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import api from "../../config/api";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuarioParaDeletar, setUsuarioParaDeletar] = useState(null); // id do usuário
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await api.get("/usuarios/listar", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletarClick = (id) => {
    setUsuarioParaDeletar(id);
    setShowModal(true);
  };

  const confirmarDelecao = async () => {
    try {
      await api.delete(`/usuarios/deletar/${usuarioParaDeletar}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      setUsuarioParaDeletar(null);
      fetchUsuarios(); // atualiza a lista
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
    }
  };

  const colunas = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Nome Completo", selector: (row) => row.nomeCompleto, sortable: true },
    { name: "Nome Amigável", selector: (row) => row.nomeAmigavel, sortable: true },
    { name: "Nome User", selector: (row) => row.nomeUser, sortable: true },
    { 
      name: 'Status',
      selector: row => (row.ativo ? 'Ativo' : 'Inativo'),
      sortable: true,
      cell: row => (
        <span className={`badge bg-${row.ativo ? 'success' : 'secondary'}`}>
          {row.ativo ? 'Ativo' : 'Inativo'}
        </span>
      )
    },
    {
      name: "Ações",
      cell: (row) => (
        <div className="d-flex gap-2">
          <Link
            to={`/controle-de-usuarios/usuarios/${row.id}/editar`}
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
        <h2 className="text-xl font-bold">Lista de Usuários</h2>
        <Link
          to="/controle-de-usuarios/usuarios/cadastrar"
          className="btn btn-primary px-4 py-2"
        >
          Cadastrar Usuário
        </Link>
      </div>

      <DataTable
        columns={colunas}
        data={usuarios}
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
                <p>Tem certeza que deseja deletar este usuário?</p>
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

export default ListaUsuarios;
