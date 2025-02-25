import { useEffect, useState } from "react";
import { ApiBaseUrl } from "../../EnvFile";
import styles from "./DarkRoomDetails.module.css";
import { useGameContext } from "../../GameProvider";

type Dialog = {
  dialogId: number;
  text: string;
  label: string;
};

type TriggerAction = {
  actionId: number;
  description: string;
  miniGameData: string;
  actionTypeId: number;
  dialogs?: Dialog[];
};

type Room = {
  roomId: number;
  imgUrl: string;
  name: string;
  text: string;
  triggerActions: TriggerAction[];
};

type DarkRoomDetailsProps = {
  onExit: () => void;
};

export default function DarkRoomDetails({ onExit }: DarkRoomDetailsProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fadeOut, setFadeOut] = useState(false);
  const { setDate, date } = useGameContext();

  // States for dialog conversation
  const [currentDialog, setCurrentDialog] = useState<Dialog | null>(null);
  const [dialogOptions, setDialogOptions] = useState<Dialog[]>([]);
  const [loadingOptions, setLoadingOptions] = useState<boolean>(false);
  const [exitVisible, setExitVisible] = useState<boolean>(false);

  useEffect(() => {
    fetch(`${ApiBaseUrl}/api/Rooms/29`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch room data");
        }
        return response.json();
      })
      .then((data: Room) => {
        setRoom(data);
        setLoading(false);

        // Check if the room has a trigger action with dialogs.
        if (
          data.triggerActions &&
          data.triggerActions.length > 0 &&
          data.triggerActions[0].dialogs &&
          data.triggerActions[0].dialogs!.length > 0
        ) {
          const firstDialog = data.triggerActions[0].dialogs![0];
          setCurrentDialog(firstDialog);
          fetchDialogOptions(firstDialog.dialogId);
        } else {
          // If no dialog exists, show the exit button immediately.
          setExitVisible(true);
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Fetches child dialogs based on the provided dialogId.
  const fetchDialogOptions = async (dialogId: number) => {
    setLoadingOptions(true);
    try {
      const response = await fetch(`${ApiBaseUrl}/api/Dialogs/getOptions/${dialogId}`);
      if (response.status === 404) {
        // No further dialogs available: show the Exit button.
        setDialogOptions([]);
        setExitVisible(true);
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to fetch dialog options");
      }
      const options: Dialog[] = await response.json();
      setDialogOptions(options);
      // While options are available, hide the Exit button.
      setExitVisible(false);
    } catch (error) {
      console.error("Error fetching dialog options:", error);
      // In case of error, allow exit so the user isn’t stuck.
      setExitVisible(true);
    } finally {
      setLoadingOptions(false);
    }
  };

  // Handles clicking on a dialog option.
  const handleDialogOptionClick = async (dialog: Dialog) => {
    setCurrentDialog(dialog);
    setDialogOptions([]);
    await fetchDialogOptions(dialog.dialogId);
  };

  const handleExit = () => {
    // Increment the date by one day.
    setDate(new Date(date.getTime() + 24 * 60 * 60 * 1000));
    setFadeOut(true);
    setTimeout(() => {
      onExit();
    }, 1000); // Match the animation duration.
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

      {/* Display the dialog conversation */}
      {currentDialog && (
        <div className={styles.dialogContainer}>
          <h2>Dialog</h2>
          <p>{currentDialog.text}</p>
        </div>
      )}

      {loadingOptions && <p>Loading dialog options...</p>}

      {/* Display dialog options as buttons using the option's label */}
      {dialogOptions.length > 0 && (
        <div className={styles.dialogOptions}>
          <h3>Options:</h3>
          {dialogOptions.map((option) => (
            <button
              key={option.dialogId}
              onClick={() => handleDialogOptionClick(option)}
              className={styles.optionButton}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* Render the Exit button only if no further dialog options are available */}
      {exitVisible && (
        <button onClick={handleExit} className={styles.exitButton}>
          Exit
        </button>
      )}
    </div>
  );
}
