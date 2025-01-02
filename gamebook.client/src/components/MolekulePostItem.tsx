import React, { useState } from 'react';

const ItemForm = () => {
  const [item, setItem] = useState({
    ItemId: '', // ItemId can be a string for controlled input
    Name: '',
    Description: '',
    Action: '', // ActionType can be a string or a specific type
    Target: '', // Target is optional
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prepare the data for posting
    const postData = {
      ItemId: parseInt(item.ItemId, 10), // Convert ItemId to integer if necessary
      Name: item.Name,
      Description: item.Description,
      Action: item.Action,
      Target: item.Target ? parseInt(item.Target, 10) : null, // Target is optional
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
        Action: '',
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
          <label htmlFor="Action">Action Type:</label>
          <select
            id="Action"
            name="Action"
            value={item.Action}
            onChange={handleChange}
            required
          >
            <option value="">Select Action</option>
            <option value="ActionType1">ActionType1</option>
            <option value="ActionType2">ActionType2</option>
            <option value="ActionType3">ActionType3</option>
          </select>
        </div>
        <div>
          <label htmlFor="Target">Target (optional):</label>
          <input
            type="number"
            id="Target"
            name="Target"
            value={item.Target}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Create Item</button>
      </form>
    </div>
  );
};

export default ItemForm;
