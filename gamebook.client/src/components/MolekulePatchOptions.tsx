import React, { useState } from "react";

const UpdateOptions: React.FC = () => {
  const [actionId, setActionId] = useState<number | null>(null);
  const [optionIds, setOptionIds] = useState<string>(""); // Comma-separated Option IDs
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async () => {
    // Validate inputs
    if (!actionId || actionId <= 0) {
      alert("Please enter a valid Action ID.");
      return;
    }

    if (!optionIds) {
      alert("Please enter valid Option IDs (comma-separated).");
      return;
    }

    // Parse OptionIds into an array of integers
    const parsedOptionIds = optionIds
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));

    if (parsedOptionIds.length === 0) {
      alert("Please provide valid Option IDs in the correct format (e.g., 1, 2, 3).");
      return;
    }

    // Prepare the payload
    const payload = {
      OptionIds: parsedOptionIds,
    };

    setIsSubmitting(true);
    setResponseMessage(null);

    try {
      const response = await fetch(`https://localhost:7058/api/GameBookActions/${actionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred.");
      }

      const responseData = await response.json();
      setResponseMessage("Options updated successfully!");
      console.log("Updated Action:", responseData);
    } catch (error: any) {
      setResponseMessage(`Failed to update options: ${error.message}`);
      console.error("API Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3>Update GameBook Action Options</h3>

      {/* Action ID Input */}
      <div>
        <label htmlFor="actionId">Action ID:</label>
        <input
          id="actionId"
          type="number"
          placeholder="Enter Action ID (e.g., 5)"
          value={actionId || ""}
          onChange={(e) => setActionId(Number(e.target.value))}
        />
      </div>

      {/* Option IDs Input */}
      <div>
        <label htmlFor="optionIds">Option IDs:</label>
        <input
          id="optionIds"
          type="text"
          placeholder="Enter Option IDs (e.g., 1, 2, 3)"
          value={optionIds}
          onChange={(e) => setOptionIds(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        style={{ marginTop: "1em" }}
      >
        {isSubmitting ? "Submitting..." : "Update Options"}
      </button>

      {/* Response Message */}
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default UpdateOptions;
