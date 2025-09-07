import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import api from "../../config/api";
import { Link } from "react-router-dom"; // 👈 Import necessário

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // 👈 Pega o token salvo no login

    api
      .get("http://localhost:8601/usuarios/listar", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar usuários:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const colunas = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Nome Completo",
      selector: (row) => row.nomeCompleto,
      sortable: true,
    },
    {
      name: "Nome Amigável",
      selector: (row) => row.nomeAmigavel,
      sortable: true,
    },
    {
      name: "Nome User",
      selector: (row) => row.nomeUser,
      sortable: true,
    },
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
  ];

  return (
    <div className="p-6">
      <div className="mb-4" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="text-xl font-bold">Lista de Usuários</h2>
        <Link
          to="/controle-de-usuarios/usuarios/cadastrar" // 👈 Rota da página de cadastro
          className="bg-blue-500 btn btn-primary px-4 py-2 rounded"
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
    </div>
  );
}

export default ListaUsuarios;
