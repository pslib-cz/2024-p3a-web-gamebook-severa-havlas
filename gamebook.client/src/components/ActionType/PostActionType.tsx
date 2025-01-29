import React, { useState } from 'react';
import { ApiBaseUrl } from '../../EnvFile';
const ActionTypeForm = () => {
  const [actionType, setActionType] = useState({
    ActionTypeId: '', // ActionTypeId can be an integer or a string for controlled input
    Name: '', // Action type name
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setActionType((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prepare the data for posting
    const postData = {
      ActionTypeId: parseInt(actionType.ActionTypeId, 10), // Convert ActionTypeId to integer if necessary
      Name: actionType.Name,
    };

    try {
      const response = await fetch(`${ApiBaseUrl}/api/ActionTypes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Failed to create action type');
      }

      const result = await response.json();
      console.log('Action Type Created:', result);
      alert('Action Type successfully created!');
      // Optionally reset the form or navigate to another page
      setActionType({
        ActionTypeId: '',
        Name: '',
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating action type');
    }
  };

  return (
    <div>
      <h2>Create New Action Type</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="ActionTypeId">Action Type ID:</label>
          <input
            type="number"
            id="ActionTypeId"
            name="ActionTypeId"
            value={actionType.ActionTypeId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="Name">Name:</label>
          <input
            type="text"
            id="Name"
            name="Name"
            value={actionType.Name}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Create Action Type</button>
      </form>
    </div>
  );
};

export default ActionTypeForm;
