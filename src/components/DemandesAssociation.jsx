import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useToken } from "../App";

const TablettesAssociees = () => {
  const [tabletteData, setTabletteData] = useState([]);
  const [filteredTabletteData, setFilteredTabletteData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { token } = useToken();

  useEffect(() => {
    if (!token) {
      alert("No token found. Please log in.");
    } else {
      // Fetch the initial data with token
      axios.get("http://localhost:8000/api/tablette", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          console.log(response.data);
          setTabletteData(response.data);
          setFilteredTabletteData(response.data);
        })
        .catch(error => {
          console.error('Error fetching tablette data:', error); 
        });
    }
  }, [token]);

  const handleUpdateStatus = async (tablette, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/api/tablette/edit/${tablette.id_tablette}`,{
        "device_id":tablette.device_id ,
        "statut": newStatus,
        "code_association": ""
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedTabletteData = tabletteData.map(t =>
        t.device_id === tablette.device_id ? { ...t, statut: newStatus } : t
      );
      setTabletteData(updatedTabletteData);
      setFilteredTabletteData(updatedTabletteData);
      alert(`Le statut de la tablette a été mis à jour à ${newStatus} avec succès !`);
    } catch (error) {
      console.error(`Une erreur est produite lors de la mise à jour du statut de la tablette à ${newStatus} :`, error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredTabletteData(tabletteData);
    } else {
      const filtered = tabletteData.filter(tablette =>
        tablette.device_id.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTabletteData(filtered);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-3 gap-4 items-center">
        <div>
          <h1 className="text-xl mb-4 mr-10">Les demandes d'associations</h1>
        </div>
        <div></div>
        <div>
          <label className="input bg-gray-300 input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        </div>
      </div>

      <table className="table lg:w-[70vw] w-full">
        <thead>
          <tr className="text-slate-700">
            <th>Device ID</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTabletteData.map((tablette) => {
            if (tablette.statut === 'non associer') {
              return (
                <tr className="cursor-pointer" key={tablette.id_tablette}>
                  <td>{tablette.device_id}</td>
                  <td>{tablette.statut}</td>
                  <td className="flex gap-4">
                    <button
                      className="p-3 rounded-md bg-red-500 text-white hover:bg-red-700 focus:outline-none"
                      onClick={() => handleUpdateStatus(tablette, 'refuser')}
                    >
                      Refuser
                    </button>
                    <button
                      className="btn p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
                      onClick={() => handleUpdateStatus(tablette, 'associer')}
                    >
                      Accepter
                    </button>
                    <button
                      className="btn p-3 rounded-md bg-black text-white hover:bg-gray-700 focus:outline-none"
                      onClick={() => handleUpdateStatus(tablette, 'bloquer')}
                    >
                      Bloquer
                    </button>
                  </td>
                </tr>
              );
            }
            return null;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TablettesAssociees;
