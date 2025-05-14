import React, { useState, useEffect } from 'react';
import CertificationModal from './CertificationModal';

const CertificationSection = () => {
  const [certs, setCerts] = useState([]);
  const [search, setSearch] = useState('');
  const [editingCert, setEditingCert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  const fetchCerts = async () => {
    const url = search.trim()
      ? `http://localhost:8070/api/certifications/search/${userId}?query=${search}`
      : `http://localhost:8070/api/certifications/${userId}`;
    const res = await fetch(url);
    const data = await res.json();
    setCerts(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      await fetch(`http://localhost:8070/api/certifications/${id}`, {
        method: 'DELETE'
      });
      fetchCerts();
    }
  };

  useEffect(() => {
    fetchCerts();
  }, [search, showModal]);

  return (
    <div className="bg-white shadow rounded p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Certifications</h2>
        <button
          onClick={() => { setEditingCert(null); setShowModal(true); }}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Add Certificate
        </button>
      </div>
      <input
        type="text"
        placeholder="Search by name, org, or date"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-2 mb-4"
      />
      <div className="space-y-4">
        {certs.map(cert => (
          <div key={cert.id} className="border p-3 rounded shadow-sm relative">
            {cert.certificateImageBase64 && (
              <img
                src={`data:image/png;base64,${cert.certificateImageBase64}`}
                alt="Certificate"
                className="h-32 object-contain mb-2"
              />
            )}
            <h3 className="text-lg font-bold">{cert.name}</h3>
            <p className="text-sm">Issued by: {cert.organization}</p>
            <p className="text-sm">Issue Date: {cert.issueDate?.split('T')[0]}</p>
            <p className="text-sm">Credential ID: {cert.credentialId}</p>
            <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm">
              View Credential
            </a>
            <div className="flex gap-2 mt-2">
              <button
                className="px-2 py-1 text-sm bg-yellow-400 text-white rounded"
                onClick={() => { setEditingCert(cert); setShowModal(true); }}
              >
                Update
              </button>
              <button
                className="px-2 py-1 text-sm bg-red-600 text-white rounded"
                onClick={() => handleDelete(cert.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <CertificationModal
          onClose={() => setShowModal(false)}
          onSaved={fetchCerts}
          initialData={editingCert}
        />
      )}
    </div>
  );
};

export default CertificationSection;
