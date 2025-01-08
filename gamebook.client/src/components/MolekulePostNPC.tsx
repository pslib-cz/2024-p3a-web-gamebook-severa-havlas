import React, { useState, useEffect } from 'react';

interface NPC {
  
  Name: string;
  Description: string;
  Action: number; // Changed to number type for GameBookAction
  Target?: number;
}

const CreateNPCForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [gamebookactionId, setGamebookactionId] = useState<string>(''); // Text input for number, but treated as string
  const [error, setError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Effect to handle form reset after successful NPC creation
  useEffect(() => {
    if (isSuccess) {
      setName('');
      setDescription('');
      setGamebookactionId('');
    }
  }, [isSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const actionId = parseInt(gamebookactionId, 10);

    // Ensure the actionId is a valid number (e.g., 1, 2, 3)
    if (![1, 2, 3].includes(actionId)) {
      setError('Please enter a valid GameBook Action ID (1, 2, or 3).');
      return;
    }

    const newNPC: NPC = {
      
      Name: name,
      Description: description,
      Action: actionId,
    };

    try {
      const response = await fetch('https://localhost:7058/api/NPCs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNPC),
      });

      if (!response.ok) {
        throw new Error('An error occurred while creating NPC.');
      }

      const createdNPC = await response.json();
      console.log('NPC created:', createdNPC);

      setIsSuccess(true);
      setError('');
    } catch (err: any) {
      setIsSuccess(false);
      setError(err.message || 'An error occurred while creating NPC.');
    }
  };

  return (
    <div>
      <h2>Create NPC</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="gamebookactionId">Gamebook Action ID:</label>
          <input
            type="number"
            id="gamebookactionId"
            value={gamebookactionId}
            onChange={(e) => setGamebookactionId(e.target.value)}
            required
          />
          <small>Enter a valid GameBook Action ID: 1, 2, or 3</small>
        </div>

        <button type="submit">Create NPC</button>
      </form>

      {isSuccess && <p style={{ color: 'green' }}>NPC created successfully!</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CreateNPCForm;
