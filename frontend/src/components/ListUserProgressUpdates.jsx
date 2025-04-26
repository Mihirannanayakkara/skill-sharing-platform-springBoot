import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/ListUserProgressUpdate.css";

const ListUserProgressUpdate = () => {
  //const { userId } = useParams(); // Get userId from route param
  const userId = "680c843384e1b45abee0f37b";
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgressUpdates = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/progress-updates/user/${userId}`
        );
        const data = response.data;
        const validData = data?.filter((item) => item && item.id);
        setProgressUpdates(validData || []);
      } catch (error) {
        console.error("Error fetching user's progress updates:", error);
        setError("Failed to load progress updates");
      }
    };

    if (userId) {
      fetchProgressUpdates();
    }
  }, [userId]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="progressUpdates">
      <h2 className="progress-heading">Progress Updates List</h2>
      {progressUpdates.length === 0 ? (
        <p>No progress updates available.</p>
      ) : (
        progressUpdates.map((item) => (
          <div key={item.id} className="progress-card">
            <h3>{item?.name || "No Name Provided"}</h3>
            <p>
              <strong>Issued By:</strong> {item?.issuingOrganization || "N/A"}
            </p>
            <p>
              <strong>Issue Date:</strong> {item?.issueDate?.month}/
              {item?.issueDate?.year}
            </p>
            {item?.expireDate?.year !== 0 && (
              <p>
                <strong>Expire Date:</strong> {item?.expireDate?.month}/
                {item?.expireDate?.year}
              </p>
            )}
            <p>
              <strong>Credential ID:</strong> {item?.credentialId || "N/A"}
            </p>
            <a
              href={item?.credentialUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Certificate
            </a>
            <br />
            <img
              src={item?.mediaUrl || "#"}
              alt={`${item?.name} Certificate`}
              width="200"
            />
            {Array.isArray(item.skills) && item.skills.length > 0 && (
              <div>
                <strong>Skills:</strong>
                <ul>
                  {item.skills.map((skill, index) => (
                    <li key={skill?.id || index}>
                      {skill?.name || "Unnamed Skill"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ListUserProgressUpdate;
