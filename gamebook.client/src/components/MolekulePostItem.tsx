import React, { useState, useEffect } from 'react';

const ItemForm = () => {
  const [item, setItem] = useState({
    ItemId: '', // ItemId can be a string for controlled input
    Name: '',
    Description: '',
    Action: {
      actionTypeId: '', // ActionTypeId for the action object
      name: '', // Name for the action
    },
    Target: '', // Target is optional
  });

  const [actionTypes, setActionTypes] = useState<any[]>([]); // Assuming you want to populate ActionType options

  // Fetch Action Types when the component mounts (useEffect)
  useEffect(() => {
    const fetchActionTypes = async () => {
      try {
        const response = await fetch('https://localhost:7058/api/ActionTypes');
        if (!response.ok) {
          throw new Error('Failed to fetch action types');
        }
        const data = await response.json();
        setActionTypes(data); // Store action types in state
      } catch (error) {
        console.error('Error fetching action types:', error);
      }
    };

    fetchActionTypes(); // Fetch action types on component mount
  }, []); // Empty dependency array means this runs only once when the component mounts

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'Action.actionTypeId' || name === 'Action.name') {
      setItem((prevState) => ({
        ...prevState,
        Action: {
          ...prevState.Action,
          [name.split('.')[1]]: value,
        },
      }));
    } else {
      setItem((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prepare the data for posting in the correct format
    const postData = {
      itemId: parseInt(item.ItemId, 10), // Convert ItemId to integer if necessary
      name: item.Name,
      description: item.Description,
      action: {
        actionTypeId: parseInt(item.Action.actionTypeId, 10), // Convert actionTypeId to integer
        name: item.Action.name, // Use the action name from the form
      },
      target: item.Target ? parseInt(item.Target, 10) : null, // Target is optional
    };

    try {
      const response = await fetch('https://localhost:7058/api/Items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Failed to create item');
      }

      const result = await response.json();
      console.log('Item Created:', result);
      alert('Item successfully created!');
      // Optionally reset the form or navigate to another page
      setItem({
        ItemId: '',
        Name: '',
        Description: '',
        Action: {
          actionTypeId: '',
          name: '',
        },
        Target: '',
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating item');
    }
  };

  return (
    <div>
      <h2>Create New Item</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="ItemId">Item ID:</label>
          <input
            type="number"
            id="ItemId"
            name="ItemId"
            value={item.ItemId}
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
            value={item.Name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="Description">Description:</label>
          <input
            type="text"
            id="Description"
            name="Description"
            value={item.Description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="Action.actionTypeId">Action Type ID:</label>
          <input
            type="number"
            id="Action.actionTypeId"
            name="Action.actionTypeId"
            value={item.Action.actionTypeId}
            onChange={handleChange}
            required
            placeholder="Enter ActionTypeId"
          />
        </div>
        <div>
          <label htmlFor="Action.name">Action Name:</label>
          <input
            type="text"
            id="Action.name"
            name="Action.name"
            value={item.Action.name}
            onChange={handleChange}
            required
            placeholder="Enter Action Name"
          />
        </div>
        <div>
          <label htmlFor="Target">Target (optional):</label>
          <input
            type="number"
            id="Target"
            name="Target"
            value={item.Target}
            onChange={handleChange}
            placeholder="Optional Target ID"
          />
        </div>
        <button type="submit">Create Item</button>
      </form>
    </div>
  );
};

export default ItemForm;
