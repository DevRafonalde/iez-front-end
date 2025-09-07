import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";

function Permissoes() {
  const [permissoes, setPermissoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // 👈 Pega o token salvo no login

    axios
      .get("http://localhost:8601/permissoes/listar", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPermissoes(response.data); // 👈 Ajuste se a sua API retornar algo diferente
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
      name: "Nome",
      selector: (row) => row.nome,
      sortable: true,
    },
    {
      name: "Descrição",
      selector: (row) => row.descricao,
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
      <h2 className="text-xl font-bold mb-4">Lista de Permissões</h2>
      <DataTable
        columns={colunas}
        data={permissoes}
        progressPending={loading}
        pagination
      />
    </div>
  );
}

export default Permissoes;
