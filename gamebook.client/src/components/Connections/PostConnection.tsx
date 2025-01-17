import React, { useState } from 'react';

const PostConnection: React.FC = () => {
  const [fromRoomId, setFromRoomId] = useState<number | ''>('');
  const [toRoomId, setToRoomId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async () => {
    if (!fromRoomId || !toRoomId) {
      setMessage('Both FromRoomId and ToRoomId are required.');
      return;
    }

    const connectionData = {
      fromRoomId: fromRoomId,
      toRoomId: toRoomId,
    };

    try {
      setLoading(true);
      setMessage('');

      const response = await fetch('https://localhost:7058/api/Connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(connectionData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create the connection.');
      }

      const result = await response.json();
      setMessage(`Connection created successfully! ConnectionId: ${result.connectionId}`);
    } catch (error: any) {
      setMessage(`Error: ${error.message || 'Something went wrong'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Connection</h1>
      <div>
        <label>
          FromRoomId:
          <input
            type="number"
            value={fromRoomId}
            onChange={(e) => setFromRoomId(parseInt(e.target.value) || '')}
          />
        </label>
      </div>
      <div>
        <label>
          ToRoomId:
          <input
            type="number"
            value={toRoomId}
            onChange={(e) => setToRoomId(parseInt(e.target.value) || '')}
          />
        </label>
      </div>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Creating...' : 'Create Connection'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PostConnection;
