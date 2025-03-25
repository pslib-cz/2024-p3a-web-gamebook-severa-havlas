import { useEffect, useState } from "react";
import { ApiBaseUrl } from "../../EnvFile";
import styles from "./DarkRoomDetails.module.css";
import { useGameContext } from "../../GameProvider";
import { Room, Dialog } from "../../types/types2";

type DarkRoomDetailsProps = {
  onExit: () => void;
};

export default function DarkRoomDetails({ onExit }: DarkRoomDetailsProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fadeOut, setFadeOut] = useState<boolean>(false);
  const { setDate, date, stamina, setStamina } = useGameContext();
  
  const [currentDialog, setCurrentDialog] = useState<Dialog | null>(null);
  const [dialogOptions, setDialogOptions] = useState<Dialog[]>([]);
  const [loadingOptions, setLoadingOptions] = useState<boolean>(false);
  const [exitVisible, setExitVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchRequiredProgress = async (actionId: number) => {
      try {
        const response = await fetch(`${ApiBaseUrl}/api/GameBookActions/GetRequireds/${actionId}`);
        if (!response.ok) throw new Error("Failed to fetch required progress");
    
        const data = await response.json();
        if (!data.requiredProgress) return null;
    
        const parsedName = JSON.parse(data.requiredProgress.name); // Extract JSON string
        return parsedName.date.split("T")[0]; // Convert to YYYY-MM-DD format
      } catch (error) {
        console.error("Error fetching required progress:", error);
        return null;
      }
    };
    
    const fetchRoomData = async () => {
      try {
        const response = await fetch(`${ApiBaseUrl}/api/Rooms/29`);
        if (!response.ok) throw new Error("Failed to fetch room data");
    
        const roomData = await response.json();
        setRoom(roomData);
        setLoading(false);
    
    
       
       
    
        if (!roomData.triggerActions || roomData.triggerActions.length === 0) {
          setExitVisible(true);
          return;
        }
        const formattedGameDate = formatDateToYYYYMMDD(date);
        // Fetch required progress for each action and find the correct one
        for (const action of roomData.triggerActions) {
          const actionDate = await fetchRequiredProgress(action.actionId);
          console.log("Checking Action Date:", actionDate, "against", formattedGameDate);
       
          if (actionDate === formattedGameDate) {
            console.log("Action Date Matches Game Date");
            setCurrentDialog(action.dialogs[0]);
            fetchDialogOptions(action.dialogs[0].dialogId);
            return;
          }
          
        }
        console.log("Action Date Does Not Match Game Date");
        // If no matching action is found, set exit visible
        setExitVisible(true);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
        setLoading(false);
      }
    };
    
    fetchRoomData();
  }, []); // Runs when `date` from context changes

  const formatDateToYYYYMMDD = (date: Date) => {
    return date.getFullYear() +
      "-" + String(date.getMonth() + 1).padStart(2, "0") +
      "-" + String(date.getDate()).padStart(2, "0");
  };
  
  const fetchDialogOptions = async (dialogId: number) => {
    setLoadingOptions(true);
    try {
      const response = await fetch(`${ApiBaseUrl}/api/Dialogs/getOptions/${dialogId}`);
      if (!response.ok) throw new Error("Failed to fetch dialog options");
      const options: Dialog[] = await response.json();
      setDialogOptions(options.length ? options : []);
      setExitVisible(options.length === 0);
    } catch (error) {
      
      console.error("Error fetching dialog options:", error);
      setExitVisible(true);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleDialogOptionClick = async (dialog: Dialog) => {
    setCurrentDialog(dialog);
    setDialogOptions([]);
    await fetchDialogOptions(dialog.dialogId);
  };

  const handleExit = () => {
    setDate(new Date(date.getTime() + 24 * 60 * 60 * 1000));
    setStamina(300);
    setFadeOut(true);
    setTimeout(onExit, 1000);
  };

  if (loading) return <p className={styles.text}>Loading...</p>;
  if (error) return <p className={styles.text}>Error: {error}</p>;
  if (!room) return <p className={styles.text}>No room data available.</p>;

  return (
    <div className={`${styles.container} ${fadeOut ? styles.fadeOut : ""}`}>
      <h1 className={styles.title}>{room.name || "Unknown Room"}</h1>
      <p className={styles.description}>{room.text || "No description available."}</p>
      {room.imgUrl && (
        <div className={styles.imageContainer}>
          <img src={`${ApiBaseUrl}${room.imgUrl}`} alt={room.name} className={styles.image} />
        </div>
      )}
      <div className={styles.dialogsContainer}>
        {currentDialog && (
          <div className={styles.dialogContainer}>
            <p>{currentDialog.text}</p>
          </div>
        )}
        {loadingOptions && <p>Loading dialog options...</p>}
        {dialogOptions.length > 0 && (
          <div className={styles.dialogOptions}>
            {dialogOptions.map((option) => (
              <button key={option.dialogId} onClick={() => handleDialogOptionClick(option)} className={styles.optionButton}>
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {exitVisible && <button onClick={handleExit} className={styles.exitButton}>Exit</button>}
    </div>
  );
}
