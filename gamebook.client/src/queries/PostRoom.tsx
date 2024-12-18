export type RoomDTO = {
  name: string;
  text: string;
  imgBase64: string;
};

export const postRoom = async (roomDTO: RoomDTO): Promise<void> => {
  try {
    const response = await fetch("https://localhost:7058/api/Rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roomDTO), // Send the RoomDTO data
    });

    if (!response.ok) {
      throw new Error(`Failed to create room: ${response.status}`);
    }

    const result = await response.json();
    console.log("Room created successfully:", result);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error posting room:", error.message);
    } else {
      console.error("Unexpected error posting room:", error);
    }
  }
};
export default postRoom;