import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // 👈 Pega o token salvo no login

    axios
      .get("http://localhost:8601/api/usuarios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsuarios(response.data); // 👈 Ajuste se a sua API retornar algo diferente
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
      name: "Perfis",
      cell: (row) => (
        <div className="relative group">
          <button className="bg-blue-500 text-white px-3 py-1 rounded">
            Ver Perfis
          </button>
          <div className="absolute hidden group-hover:block bg-white border rounded shadow-md p-2 z-10 w-40">
            {row.perfis && row.perfis.length > 0 ? (
              <ul>
                {row.perfis.map((perfil, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    {perfil}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-sm text-gray-500">Sem perfis</span>
            )}
          </div>
        </div>
      ),
    },
    {
      name: "Ativo",
      selector: (row) => (row.ativo ? "Sim" : "Não"),
      sortable: true,
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Lista de Usuários</h2>
      <DataTable
        columns={colunas}
        data={usuarios}
        progressPending={loading}
        pagination
      />
    </div>
  );
}

export default Usuarios;
