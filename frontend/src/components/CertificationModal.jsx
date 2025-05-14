import React, { useState, useEffect } from 'react';

const CertificationModal = ({ onClose, onSaved, initialData }) => {
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  const [form, setForm] = useState({
    name: '',
    organization: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    skills: '',
    certificateImageBase64: ''
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        skills: initialData.skills.join(','),
        issueDate: initialData.issueDate?.split('T')[0] || '',
        expiryDate: initialData.expiryDate?.split('T')[0] || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      setForm(prev => ({ ...prev, certificateImageBase64: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      userId,
      skills: form.skills.split(',').map(s => s.trim())
    };

    const method = initialData ? 'PUT' : 'POST';
    const url = initialData
      ? `http://localhost:8070/api/certifications/${initialData.id}`
      : `http://localhost:8070/api/certifications`;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    try {
      const skillsArray = payload.skills;
      const res = await fetch(`http://localhost:8070/api/skills/${userId}`);
      const existingSkills = await res.json();
      const existingSkillNames = existingSkills.map(skill => skill.name.toLowerCase());

      for (const skill of skillsArray) {
        if (!existingSkillNames.includes(skill.toLowerCase())) {
          await fetch('http://localhost:8070/api/skills', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: skill, userId })
          });
        }
      }
    } catch (err) {
      console.error('Failed to add skills to skill section:', err);
    }

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl">✕</button>
        <h2 className="text-2xl font-semibold">{initialData ? 'Update' : 'Add'} Certification</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" placeholder="Certification Name" value={form.name} onChange={handleChange} required className="w-full border p-2" />
          <input name="organization" placeholder="Issuing Organization" value={form.organization} onChange={handleChange} required className="w-full border p-2" />
          <input type="date" name="issueDate" value={form.issueDate} onChange={handleChange} required className="w-full border p-2" />
          <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} className="w-full border p-2" />
          <input name="credentialId" placeholder="Credential ID" value={form.credentialId} onChange={handleChange} required className="w-full border p-2" />
          <input name="credentialUrl" placeholder="Credential URL" value={form.credentialUrl} onChange={handleChange} required className="w-full border p-2" />
          <input name="skills" placeholder="Skills Gained (comma separated)" value={form.skills} onChange={handleChange} required className="w-full border p-2" />
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
            {initialData ? 'Save Changes' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CertificationModal;
