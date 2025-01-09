import React, { useState } from "react";
import axios from "axios";

interface Option {
  optionId: number;
  label: string;
  text: string;
  nextActionId: number;
}

const FetchOptions: React.FC = () => {
  const [optionIds, setOptionIds] = useState<string>(""); // Input field value (comma-separated IDs)
  const [options, setOptions] = useState<Option[] | null>(null); // Fetched options
  const [error, setError] = useState<string | null>(null); // Error message

  const handleFetchOptions = async () => {
    // Clear previous error and results
    setError(null);
    setOptions(null);

    // Parse input into an array of integers
    const idsArray = optionIds
      .split(",")
      .map((id) => id.trim())
      .filter((id) => !isNaN(Number(id)))
      .map(Number);

    if (idsArray.length === 0) {
      setError("Please enter valid option IDs.");
      return;
    }

    try {
      const response = await axios.patch<Option[]>("/api/options/find-options", {
        optionIds: idsArray,
      });
      setOptions(response.data);
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setError("No options found for the provided IDs.");
      } else {
        setError("An error occurred while fetching options.");
      }
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Fetch Options</h2>
      <p>Enter a comma-separated list of option IDs to fetch their details:</p>
      <input
        type="text"
        value={optionIds}
        onChange={(e) => setOptionIds(e.target.value)}
        placeholder="E.g., 1, 2, 3"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      <button
        onClick={handleFetchOptions}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Fetch Options
      </button>

      {error && (
        <div
          style={{
            marginTop: "20px",
            color: "red",
            fontWeight: "bold",
          }}
        >
          {error}
        </div>
      )}

      {options && options.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Fetched Options:</h3>
          <ul>
            {options.map((option) => (
              <li key={option.optionId} style={{ marginBottom: "10px" }}>
                <strong>Option ID:</strong> {option.optionId} <br />
                <strong>Label:</strong> {option.label} <br />
                <strong>Text:</strong> {option.text} <br />
                <strong>Next Action ID:</strong> {option.nextActionId}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FetchOptions;
