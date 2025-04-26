import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Calendar, Award, Upload, X, Check, ArrowLeft } from "lucide-react";

const CreateProgressUpdate = () => {
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
    skills: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const userId = "680c843384e1b45abee0f37b";

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // Create preview URL
      const fileUrl = URL.createObjectURL(e.target.files[0]);
      setPreviewUrl(fileUrl);
      setFormData((prev) => ({
        ...prev,
        mediaUrl: fileUrl,
      }));
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData((prev) => ({
      ...prev,
      mediaUrl: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const skillsList = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0); // Filter out empty values

    // If no skills are provided, do not include them or set to an empty array
    const dto = {
      name: formData.name,
      issuingOrganization: formData.issuingOrganization,
      issueDate: {
        month: parseInt(formData.issueDateMonth),
        year: parseInt(formData.issueDateYear),
      },
      expireDate: {
        month: parseInt(formData.expireDateMonth) || 0,
        year: parseInt(formData.expireDateYear) || 0,
      },
      credentialId: formData.credentialId,
      credentialUrl: formData.credentialUrl,
      mediaUrl: formData.mediaUrl,
      skills: skillsList.length > 0 ? skillsList : [], // Only add skills if not empty
    };

    try {
      await axios.post(
        `http://localhost:8081/api/v1/progress-updates/add/${userId}`,
        dto
      );
      setFormSuccess(true);
      setTimeout(() => {
        navigate("/profileProgress");
      }, 1500);
    } catch (err) {
      console.error("Error creating progress update:", err);
      alert("Failed to create progress update.");
      setIsSubmitting(false);
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - 15 + i);

  if (formSuccess) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-lg shadow-2xl transform transition-all duration-500 scale-100 opacity-100 animate-bounce">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
            <p className="text-gray-600">
              Your progress update has been created.
            </p>
            <p className="text-gray-500 text-sm mt-2">Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/profileProgress")}
          className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span>Back to Profile</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
          <div className="bg-indigo-600 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Award className="mr-2" size={24} />
              Create Progress Update
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Input */}
              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  Name
                </label>
                <input
                  name="name"
                  placeholder="Certificate or Achievement Name"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Organization Input */}
              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  Issuing Organization
                </label>
                <input
                  name="issuingOrganization"
                  placeholder="e.g. Udemy, Coursera, University"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Issue Date Inputs */}
              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <Calendar className="mr-1" size={18} />
                  Issue Date
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <select
                      name="issueDateMonth"
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      <option value="">Select Month</option>
                      {months.map((m) => (
                        <option key={m} value={m}>
                          {new Date(0, m - 1).toLocaleString("default", {
                            month: "long",
                          })}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select
                      name="issueDateYear"
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      <option value="">Select Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Expiry Date Inputs */}
              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <Calendar className="mr-1" size={18} />
                  Expiration Date (Optional)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <select
                      name="expireDateMonth"
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      <option value="">Select Month</option>
                      {months.map((m) => (
                        <option key={m} value={m}>
                          {new Date(0, m - 1).toLocaleString("default", {
                            month: "long",
                          })}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select
                      name="expireDateYear"
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      <option value="">Select Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Credential ID */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Credential ID
                </label>
                <input
                  name="credentialId"
                  placeholder="Certificate ID (Optional)"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Credential URL */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Credential URL
                </label>
                <input
                  name="credentialUrl"
                  placeholder="Link to verify certificate (Optional)"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Skills */}
              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  Skills
                </label>
                <input
                  name="skills"
                  placeholder="Skills (comma separated, e.g. JavaScript, React, CSS)"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* File Upload */}
              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <Upload className="mr-1" size={18} />
                  Upload Certificate Image
                </label>

                {!selectedFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="certificate-upload"
                    />
                    <label
                      htmlFor="certificate-upload"
                      className="cursor-pointer"
                    >
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="relative mt-2">
                    <div className="relative rounded-lg overflow-hidden border border-gray-300">
                      <img
                        src={previewUrl}
                        alt="Certificate preview"
                        className="w-full h-48 object-contain"
                      />
                      <button
                        type="button"
                        onClick={removeSelectedFile}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {selectedFile.name}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow transition-all duration-300 ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-indigo-700 transform hover:scale-105"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  "Create Progress Update"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Global CSS for animations */}
      <style jsx>{`
        @keyframes slideInFromBottom {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        form > div {
          animation: slideInFromBottom 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CreateProgressUpdate;
