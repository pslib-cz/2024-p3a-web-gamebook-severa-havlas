export const PostRoom = async (roomData: { name: string; text: string; img?: string }): Promise<void> => {
  try {
    // Create the request body, including image as a Base64 string if present
    const requestBody = {
      name: roomData.name,
      text: roomData.text,
      img: roomData.img || '', // If image is not provided, set it as an empty string
    };

    const response = await fetch('/api/Rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set content type to JSON
      },
      body: JSON.stringify(requestBody), // Convert the object to a JSON string
    });

    if (!response.ok) {
      throw new Error('Failed to post room');
    }

    console.log('Room successfully posted!');
  } catch (error) {
    console.error('Error posting room:', error);
  }
};
