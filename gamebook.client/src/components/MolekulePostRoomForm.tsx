// components/MolekulePostRoomForm.tsx
import React, { useState } from 'react';
import AtomForm from './AtomForm';
import Button from './AtomButton';
import { PostRoom } from '../queries/PostRoom';
import { Room } from '../types/types';


  
const MolekulePostRoomForm: React.FC = () => {
  // Room state
  const [name, setName] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [imgFile, setImgFile] = useState<File | null>(null);
 const [imgBase64, setImgBase64] = useState<string | null>(null);
  // Handle file input change
 
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the first file selected
    if (file) {
      try {
        const base64String = await convertFileToBase64(file); // Convert to Base64
        setImgBase64(base64String); // Update state with Base64 string
      } catch (error) {
        console.error('Error converting file to Base64:', error);
      }
    }
  };
  // Submit form
  const handleSubmit = async () => {
    if (!imgBase64 || !name || !text) {
      alert('Please fill out all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('text', text);
    if (imgBase64) {
      formData.append('text', imgBase64);
    }

    try {
      await PostRoom({ name, text, img: imgBase64 });
      alert('Room posted successfully!');
      setName('');
      setText('');
      setImgFile(null);
    } catch (error) {
      alert('Failed to post room.');
    }
  };

  return (
    <div className="molekule-post-room-form" style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2>Create a New Room</h2>
      {/* Name input */}
      <AtomForm
        label="Room Name"
        placeholder="Enter room name"
        onSubmit={(value) => setName(value)}
        validationPattern={/^[a-zA-Z0-9\s]+$/}
        errorMessage="Room name can only contain letters, numbers, and spaces."
      />
      
      {/* Text input */}
      <AtomForm
        label="Room Description"
        placeholder="Enter room description"
        onSubmit={(value) => setText(value)}
      />

      {/* File input */}
      <div style={{ margin: '10px 0' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Room Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      {/* Submit button */}
      <Button
        label="Create Room"
        onClick={handleSubmit}
        color="green"
        size="medium"
      />
    </div>
  );
};
const convertFileToBase64 = (file: File): Promise<string> => {
    if (!file) return Promise.resolve('');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  
export default MolekulePostRoomForm;
