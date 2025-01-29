import React, { useState } from 'react';
import { ApiBaseUrl } from '../../EnvFile';
const PostConnection: React.FC = () => {
  const [fromRoomId, setFromRoomId] = useState<number | ''>('');
  const [toRoomId, setToRoomId] = useState<number | ''>('');
  const [x, setX] = useState<number | ''>(''); // X position
  const [y, setY] = useState<number | ''>(''); // Y position
  const [img, setImg] = useState<File | null>(null); // Image file
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImg(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!fromRoomId || !toRoomId || x === '' || y === '') {
      setMessage('FromRoomId, ToRoomId, X, and Y are required.');
      return;
    }
  
    const formData = new FormData();
    formData.append('fromRoomId', fromRoomId.toString());
    formData.append('toRoomId', toRoomId.toString());
    formData.append('x', x.toString());
    formData.append('y', y.toString());
    if (img) {
      formData.append('img', img); // Append the image file
    }
  
    try {
      setLoading(true);
      setMessage('');
  
      const response = await fetch(`${ApiBaseUrl}/api/Connections`, {
        method: 'POST',
        body: formData, // Use FormData as the request body
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
      <div>
        <label>
          X Position:
          <input
            type="number"
            value={x}
            onChange={(e) => setX(parseInt(e.target.value) || '')}
          />
        </label>
      </div>
      <div>
        <label>
          Y Position:
          <input
            type="number"
            value={y}
            onChange={(e) => setY(parseInt(e.target.value) || '')}
          />
        </label>
      </div>
      <div>
        <label>
          Image:
          <input type="file" accept="image/*" onChange={handleFileChange} />
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
