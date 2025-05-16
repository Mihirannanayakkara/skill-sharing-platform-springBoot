import React, { useState, useEffect } from 'react';
import { X, Calendar, Award, Building, Link, Hash, FileImage, Loader2, Save } from 'lucide-react';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        skills: initialData.skills.join(','),
        issueDate: initialData.issueDate?.split('T')[0] || '',
        expiryDate: initialData.expiryDate?.split('T')[0] || ''
      });
      
      if (initialData.certificateImageBase64) {
        setImagePreview(`data:image/png;base64,${initialData.certificateImageBase64}`);
      }
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
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        ...form,
        userId,
        skills: form.skills.split(',').map(s => s.trim()).filter(s => s)
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
    } catch (error) {
      console.error('Failed to save certification:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl relative animate-slideUp overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-750 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              {initialData ? 'Update' : 'Add'} Certification
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Certification Name */}
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Certification Name*
              </label>
              <div className="relative">
                <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  id="name"
                  name="name" 
                  placeholder="e.g. AWS Certified Solutions Architect" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 transition-colors duration-200" 
                />
              </div>
            </div>

            {/* Organization */}
            <div className="space-y-1">
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Issuing Organization*
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  id="organization"
                  name="organization" 
                  placeholder="e.g. Amazon Web Services" 
                  value={form.organization} 
                  onChange={handleChange} 
                  required 
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 transition-colors duration-200" 
                />
              </div>
            </div>

            {/* Issue Date */}
            <div className="space-y-1">
              <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Issue Date*
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  id="issueDate"
                  type="date" 
                  name="issueDate" 
                  value={form.issueDate} 
                  onChange={handleChange} 
                  required 
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 transition-colors duration-200" 
                />
              </div>
            </div>

            {/* Expiry Date */}
            <div className="space-y-1">
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Expiry Date <span className="text-gray-400 dark:text-gray-500">(optional)</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  id="expiryDate"
                  type="date" 
                  name="expiryDate" 
                  value={form.expiryDate} 
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 transition-colors duration-200" 
                />
              </div>
            </div>

            {/* Credential ID */}
            <div className="space-y-1">
              <label htmlFor="credentialId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Credential ID*
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  id="credentialId"
                  name="credentialId" 
                  placeholder="e.g. ABC123XYZ" 
                  value={form.credentialId} 
                  onChange={handleChange} 
                  required 
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 transition-colors duration-200" 
                />
              </div>
            </div>

            {/* Credential URL */}
            <div className="space-y-1">
              <label htmlFor="credentialUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Credential URL*
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  id="credentialUrl"
                  name="credentialUrl" 
                  placeholder="e.g. https://verify.example.com/abc123" 
                  value={form.credentialUrl} 
                  onChange={handleChange} 
                  required 
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 transition-colors duration-200" 
                />
              </div>
            </div>

            {/* Skills */}
            <div className="sm:col-span-2 space-y-1">
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Skills Gained*
              </label>
              <input 
                id="skills"
                name="skills" 
                placeholder="e.g. Cloud Architecture, AWS, Infrastructure Design" 
                value={form.skills} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 transition-colors duration-200" 
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate multiple skills with commas</p>
            </div>

            {/* Certificate Image */}
            <div className="sm:col-span-2 space-y-1">
              <label htmlFor="certificateImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Certificate Image <span className="text-gray-400 dark:text-gray-500">(optional)</span>
              </label>
              <div className="relative">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileImage className="w-8 h-8 text-gray-400 mb-1" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {imagePreview ? 'Change image' : 'Click to upload certificate image'}
                      </p>
                    </div>
                    <input 
                      id="certificateImage" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {imagePreview && (
                <div className="mt-2 relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Certificate preview" 
                    className="w-full h-32 object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setForm(prev => ({ ...prev, certificateImageBase64: '' }));
                    }}
                    className="absolute top-2 right-2 bg-gray-800/70 text-white p-1 rounded-full hover:bg-red-600/90 transition-colors duration-200"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3 mt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>{initialData ? 'Save Changes' : 'Save Certificate'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificationModal;
