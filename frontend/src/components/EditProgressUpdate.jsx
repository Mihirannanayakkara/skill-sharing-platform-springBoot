import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Award,
  ArrowLeft,
  Check,
  Calendar,
  Building,
  Link,
  Image,
  Hash,
  Award as AwardIcon,
} from "lucide-react";

const EditProgressUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    issuingOrganization: "",
    issueDateMonth: "",
    issueDateYear: "",
    expireDateMonth: "",
    expireDateYear: "",
    credentialId: "",
    credentialUrl: "",
    mediaUrl: "",
    skills: "", // Will be shown as comma-separated string
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    const fetchProgressUpdate = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/progress-updates/${id}`
        );
        const data = response.data;

        setFormData({
          name: data.name || "",
          issuingOrganization: data.issuingOrganization || "",
          issueDateMonth: data.issueDate?.month || "",
          issueDateYear: data.issueDate?.year || "",
          expireDateMonth: data.expireDate?.month || "",
          expireDateYear: data.expireDate?.year || "",
          credentialId: data.credentialId || "",
          credentialUrl: data.credentialUrl || "",
          mediaUrl: data.mediaUrl || "",
          skills:
            Array.isArray(data.skills) && data.skills.length > 0
              ? data.skills
                  .map((s) => (typeof s === "string" ? s : s.name))
                  .join(", ")
              : "",
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching progress update:", err);
        setError("Failed to load progress update.");
        setLoading(false);
      }
    };

    fetchProgressUpdate();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      mediaUrl: previewUrl,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const skillsList = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const dto = {
      name: formData.name,
      issuingOrganization: formData.issuingOrganization,
      issueDate: {
        month: parseInt(formData.issueDateMonth),
        year: parseInt(formData.issueDateYear),
      },
      expireDate: {
        month: parseInt(formData.expireDateMonth),
        year: parseInt(formData.expireDateYear),
      },
      credentialId: formData.credentialId,
      credentialUrl: formData.credentialUrl,
      mediaUrl: formData.mediaUrl,
      skills: skillsList,
    };

    try {
      await axios.put(
        `http://localhost:8081/api/v1/progress-updates/${id}`,
        dto
      );
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/profileProgress");
      }, 1500);
    } catch (err) {
      console.error("Error updating progress update:", err);
      setError("Failed to update progress update.");
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (showSuccess) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-lg shadow-2xl transform transition-all duration-500 scale-100 opacity-100 animate-bounce">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
            <p className="text-gray-600">
              Your progress update has been saved.
            </p>
            <p className="text-gray-500 text-sm mt-2">Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/profileProgress")}
          className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span>Back to Profile</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl animate-fadeIn">
          <div className="bg-indigo-600 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Award className="mr-2" size={24} />
              Edit Progress Update
            </h2>
          </div>

          {error && (
            <div className="mx-6 mt-6 p-3 rounded-lg bg-red-100 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <AwardIcon size={16} className="mr-2" />
                Certificate Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter certificate name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-base"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <Building size={16} className="mr-2" />
                Issuing Organization
              </label>
              <input
                name="issuingOrganization"
                value={formData.issuingOrganization}
                onChange={handleChange}
                placeholder="Organization that issued the certificate"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-base"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <Calendar size={16} className="mr-2" />
                  Issue Date
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    name="issueDateMonth"
                    value={formData.issueDateMonth}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-base"
                  >
                    <option value="">Month</option>
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    name="issueDateYear"
                    value={formData.issueDateYear}
                    onChange={handleChange}
                    placeholder="Year"
                    required
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <Calendar size={16} className="mr-2" />
                  Expiry Date (Optional)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    name="expireDateMonth"
                    value={formData.expireDateMonth}
                    onChange={handleChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-base"
                  >
                    <option value="">Month</option>
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    name="expireDateYear"
                    value={formData.expireDateYear}
                    onChange={handleChange}
                    placeholder="Year"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-base"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <Hash size={16} className="mr-2" />
                Credential ID (Optional)
              </label>
              <input
                name="credentialId"
                value={formData.credentialId}
                onChange={handleChange}
                placeholder="Enter credential ID if available"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-base"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <Link size={16} className="mr-2" />
                Credential URL (Optional)
              </label>
              <input
                name="credentialUrl"
                value={formData.credentialUrl}
                onChange={handleChange}
                placeholder="Enter URL to verify this credential"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-base"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <Image size={16} className="mr-2" />
                Certificate Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-base"
              />
            </div>

            {formData.mediaUrl && (
              <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                <img
                  src={formData.mediaUrl}
                  alt="Certificate Preview"
                  className="h-48 object-contain mx-auto"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <Award size={16} className="mr-2" />
                Skills Earned
              </label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Enter skills (comma separated, e.g.: JavaScript, React, Project Management)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-base h-24"
              ></textarea>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow flex items-center transition-all duration-300 ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-indigo-700 transform hover:scale-105"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  <>
                    <Check size={18} className="mr-2" />
                    Update Progress
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Global CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(-5px);
          }
          50% {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default EditProgressUpdate;
