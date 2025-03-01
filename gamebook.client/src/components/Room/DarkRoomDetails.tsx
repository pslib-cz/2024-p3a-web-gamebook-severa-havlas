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
    fetch(`${ApiBaseUrl}/api/Rooms/29`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch room data");
        return response.json();
      })
      .then((data: Room) => {
        setRoom(data);
        setLoading(false);

        // Find the first trigger action that matches the current date
        const validTrigger = data.triggerActions && data.triggerActions.length > 0 ? data.triggerActions[0] : null;
        
        if (validTrigger && validTrigger.dialogs && validTrigger.dialogs.length > 0) {
          const firstDialog = validTrigger.dialogs[0];
          setCurrentDialog(firstDialog);
          fetchDialogOptions(firstDialog.dialogId);
        } else {
          setExitVisible(true);
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [date]);

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
    setStamina(100);
    setFadeOut(true);
    setTimeout(onExit, 1000);
  };

  if (loading) return <p className={styles.text}>Loading...</p>;
  if (error) return <p className={styles.text}>Error: {error}</p>;
  if (!room) return <p className={styles.text}>No room data available.</p>;

  return (
    <div className={`${styles.container} ${fadeOut ? styles.fadeOut : ""}`}>
      <h1 className={styles.title}>{room.name || "Unknown Room"}</h1>
      {room.imgUrl && (
        <div className={styles.imageContainer}>
          <img src={`${ApiBaseUrl}${room.imgUrl}`} alt={room.name} className={styles.image} />
        </div>
      )}
      <p className={styles.description}>{room.text || "No description available."}</p>
      {currentDialog && (
        <div className={styles.dialogContainer}>
          <h2>Dialog</h2>
          <p>{currentDialog.text}</p>
        </div>
      )}
      {loadingOptions && <p>Loading dialog options...</p>}
      {dialogOptions.length > 0 && (
        <div className={styles.dialogOptions}>
          <h3>Options:</h3>
          {dialogOptions.map((option) => (
            <button key={option.dialogId} onClick={() => handleDialogOptionClick(option)} className={styles.optionButton}>
              {option.label}
            </button>
          ))}
        </div>
      )}
      {exitVisible && <button onClick={handleExit} className={styles.exitButton}>Exit</button>}
    </div>
  );
}
