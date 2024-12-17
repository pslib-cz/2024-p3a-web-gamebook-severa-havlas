import React, { useState } from 'react';
import AtomForm from './AtomForm';
import Button from './AtomButton';
import postRoom from '../queries/PostRoom';

const CreateRoomForm: React.FC = () => {
  const [name, setName] = useState<string>(''); // State for the room name
  const [description, setDescription] = useState<string>(''); // State for the room description
  const [file, setFile] = useState<File | null>(null); // State for file input
  const [imgBase64, setImgBase64] = useState<string>(''); // State for Base64 image string
  const [isReadyToSubmit, setIsReadyToSubmit] = useState<boolean>(false);

  // Handle file selection and convert to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log('File selected:', selectedFile.name);
    }
  };

  // Convert file to Base64 string
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle submission
  const handleSubmit = async () => {
    if (!name || !description || !file) {
      alert('Please fill out all fields and select an image.');
      return;
    }

    try {
      const base64String = await convertFileToBase64(file); // Convert file
      setImgBase64(base64String);

      // Post the room
      const roomData = {
        imgBase64: base64String,
        name,
        text: description,
        items: [],
        npcs: [],
        itemPositions: [],
        connectionsFrom: [],
        connectionsTo: [],
        requiredItems: [],
        requiredNPCs: [],
        requiredActions: [],
      };

      await postRoom(roomData);
      alert('Room created successfully!');

      // Reset form
      setName('');
      setDescription('');
      setFile(null);
      setImgBase64('');
      setIsReadyToSubmit(false);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room.');
    }
  };

  // Enable submit button when all fields are ready
  React.useEffect(() => {
    if (name && description && file) {
      setIsReadyToSubmit(true);
    } else {
      setIsReadyToSubmit(false);
    }
  }, [name, description, file]);

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2>Create a New Room</h2>

      {/* Name Input */}
      <AtomForm
        label="Room Name"
        placeholder="Enter room name"
        onSubmit={(value) => setName(value)}
        validationPattern={/^[a-zA-Z0-9\s]+$/}
        errorMessage="Room name can only contain letters, numbers, and spaces."
      />

      {/* Description Input */}
      <AtomForm
        label="Room Description"
        placeholder="Enter room description"
        onSubmit={(value) => setDescription(value)}
      />

      {/* File Input */}
      <div style={{ margin: '10px 0' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Room Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {file && <p>Selected file: {file.name}</p>}
      </div>

      {/* Submit Button */}
      <Button
        label="Create Room"
        onClick={handleSubmit}
        color={isReadyToSubmit ? 'green' : 'gray'}
        size="medium"
      />
    </div>
  );
};

export default CreateRoomForm;
