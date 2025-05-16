import React, { useState, useEffect } from 'react';
import CertificationModal from './CertificationModal';
import { PlusCircle, Search, Calendar, Award, Link, Building, Hash, Pencil, Trash2 } from 'lucide-react';

const CertificationSection = () => {
  const [certs, setCerts] = useState([]);
  const [search, setSearch] = useState('');
  const [editingCert, setEditingCert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  const fetchCerts = async () => {
    setIsLoading(true);
    try {
      const url = search.trim()
        ? `http://localhost:8070/api/certifications/search/${userId}?query=${search}`
        : `http://localhost:8070/api/certifications/${userId}`;
      const res = await fetch(url);
      const data = await res.json();
      setCerts(data);
    } catch (error) {
      console.error("Failed to fetch certifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      try {
        await fetch(`http://localhost:8070/api/certifications/${id}`, {
          method: 'DELETE'
        });
        fetchCerts();
      } catch (error) {
        console.error("Failed to delete certification:", error);
      }
    }
  };

  useEffect(() => {
    fetchCerts();
  }, [search, showModal]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300">
      {/* Header Section */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Certifications</h2>
          </div>
          <button
            onClick={() => { setEditingCert(null); setShowModal(true); }}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add Certificate</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, organization, or credential ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300"
            aria-label="Search certifications"
          />
        </div>
      </div>

      {/* Certifications List */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : certs.length === 0 ? (
          <div className="text-center py-12">
            <Award className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No certifications found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {search ? "Try a different search term or" : "Get started by"} adding your first certification.
            </p>
            <button
              onClick={() => { setEditingCert(null); setShowModal(true); }}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-300"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Add Certificate</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certs.map(cert => (
              <div 
                key={cert.id} 
                className="bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
              >
                {/* Certificate Image */}
                <div className="relative h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-b border-gray-200 dark:border-gray-700">
                  {cert.certificateImageBase64 ? (
                    <img
                      src={`data:image/png;base64,${cert.certificateImageBase64}`}
                      alt={`${cert.name} Certificate`}
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <Award className="h-20 w-20 text-gray-300 dark:text-gray-600" />
                  )}
                </div>
                
                {/* Certificate Details */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">{cert.name}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <Building className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1">{cert.organization}</p>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">{cert.issueDate?.split('T')[0]}</p>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Hash className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1">{cert.credentialId}</p>
                    </div>
                    
                    {cert.credentialUrl && (
                      <div className="flex items-start gap-2">
                        <Link className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                        <a 
                          href={cert.credentialUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors duration-300"
                          aria-label={`View credential for ${cert.name}`}
                        >
                          View Credential
                        </a>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <button
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-300"
                      onClick={() => { setEditingCert(cert); setShowModal(true); }}
                      aria-label={`Edit ${cert.name} certification`}
                    >
                      <Pencil className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-300"
                      onClick={() => handleDelete(cert.id)}
                      aria-label={`Delete ${cert.name} certification`}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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