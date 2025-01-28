import React from "react";
import "./SlidingOverlay.css";

interface SlidingOverlayProps {
  isOpen: boolean; // Control overlay visibility
  overlayWidth?: string; // Control overlay width
  onClose?: () => void; // Optional: Function to close the overlay
}

const SlidingOverlay: React.FC<SlidingOverlayProps> = ({
  isOpen,
  overlayWidth = "250px",
  onClose,
}) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`overlay ${isOpen ? "open" : ""}`}
        style={{ width: overlayWidth }} // Dynamically set the overlay's width
      >
        <div className="overlay-content">
          <h2>Sliding Overlay</h2>
          <p>Welcome to the overlay!</p>
          {onClose && (
            <button onClick={onClose} className="close-button">
              Close
            </button>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && onClose && (
        <div onClick={onClose} className="backdrop" />
      )}
    </>
  );
};

export default SlidingOverlay;
