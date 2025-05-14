// src/pages/CertificatePage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import certificateTemplate from '../assets/certificate-template.png'; // make sure you save your template image inside /src/assets/

const CertificatePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [certificateId, setCertificateId] = useState('');

  useEffect(() => {
    const randomId = Math.random().toString(36).substring(2, 12).toUpperCase();
    setCertificateId(randomId);
  }, []);

  const handleDownload = () => {
    const input = document.getElementById('certificate');
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'pt', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, 842, 595);
      pdf.save('certificate.pdf');
    });
  };

  if (!state || !state.course || !state.user) {
    return <div className="p-6 text-center">No certificate data found. Please complete a course first.</div>;
  }

  const { course, user } = state;
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <div id="certificate" className="relative w-[842px] h-[595px] bg-white shadow-lg overflow-hidden">
        <img src={certificateTemplate} alt="Certificate Template" className="absolute w-full h-full object-cover" />
        <div className="absolute top-[190px] w-full text-center">
          <h1 className="text-3xl font-bold text-blue-800">{user.name}</h1>
        </div>
        <div className="absolute top-[267px] w-full text-center">
          <h2 className="text-2xl font-semibold text-gray-700">{course.title}</h2>
        </div>
        <div className="absolute bottom-[28px] left-16 text-sm text-black-600">
          Issued: {today}
        </div>
        <div className="absolute bottom-[28px] right-16 text-sm text-black-600">
          Certificate ID: {certificateId}
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={handleDownload}
          className="px-6 py-3 bg-green-600 text-white rounded shadow hover:bg-green-700"
        >
          Download Certificate
        </button>
        <button
          onClick={() => navigate('/learning-progress')}
          className="px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          Back to Learning Progress
        </button>
      </div>
    </div>
  );
};

export default CertificatePage;
