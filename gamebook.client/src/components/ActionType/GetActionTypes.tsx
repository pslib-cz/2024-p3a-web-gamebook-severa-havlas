import React, { useState, useEffect } from 'react';
import { ActionType } from '../../types/types2';
import { ApiBaseUrl } from '../../EnvFile';
export const ActionTypeList = () => {
  const [actionTypes, setActionTypes] = useState<ActionType[]>([]);

  // Fetch action types from the API when the component mounts
  useEffect(() => {
    const fetchActionTypes = async () => {
      try {
        const response = await fetch(`${ApiBaseUrl}/api/ActionTypes`);
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

  return (
    <div>
      <h2>List of Action Types</h2>
      <ul>
        {actionTypes.length === 0 ? (
          <li>Loading action types...</li>
        ) : (
          actionTypes.map((actionType) => (
            <li key={actionType.actionTypeId}>{actionType.name}  -   {actionType.actionTypeId}</li>
          ))
        )}
      </ul>
    </div>
  );
};


