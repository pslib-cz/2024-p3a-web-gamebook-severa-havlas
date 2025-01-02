import React, { useState, useEffect } from 'react';
import { ActionType } from '../types/types';

export const ActionTypeDropdown = () => {
  const [actionTypes, setActionTypes] = useState<ActionType[]>([]);
  const [selectedActionType, setSelectedActionType] = useState('');

  // Fetch action types from the API when the component mounts
  useEffect(() => {
    const fetchActionTypes = async () => {
      try {
        const response = await fetch('https://localhost:7058/api/ActionTypes');
        if (!response.ok) {
          throw new Error('Failed to fetch action types');
        }
        const data = await response.json();
        setActionTypes(data); // Assuming data is an array of action types
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchActionTypes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSelectedActionType(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedActionType) {
      alert('Please select an action type');
      return;
    }

    try {
      const response = await fetch('https://localhost:7058/api/ActionTypes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Action: selectedActionType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create item');
      }

      const result = await response.json();
      console.log('Item Created:', result);
      alert('Item successfully created with selected action type!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating item');
    }
  };

  return (
    <div>
      <h2>Create Item with Action Type</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="Action">Select Action Type:</label>
          <select id="Action" value={selectedActionType} onChange={handleChange} required>
            <option value="">Select an action type</option>
            {actionTypes.map((actionType) => (
              <option key={actionType.actionTypeId} value={actionType.name}>
                {actionType.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create Item</button>
      </form>
    </div>
  );
};


