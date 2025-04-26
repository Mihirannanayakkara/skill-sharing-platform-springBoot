import React, { useEffect, useState } from "react";
import { getProgressUpdates } from "../services/ProgressUpdateService";

const ListProgressUpdates = () => {
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgressUpdates = async () => {
      try {
        const data = await getProgressUpdates();
        const validData = data?.filter((item) => item && item.id);
        setProgressUpdates(validData || []);
      } catch (err) {
        console.error("Error fetching progress updates:", err);
        setError("Failed to load progress updates");
      }
    };

    fetchProgressUpdates();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div className="progressUpdates">
      <h2>All Progress Updates</h2>
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

export default ListProgressUpdates;
