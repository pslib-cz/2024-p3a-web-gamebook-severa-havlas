import React, { useState, useEffect } from "react";

interface PuzzlePiece {
  id: number;
  x: number;
  y: number;
  correctX: number;
  correctY: number;
  imageSrc: string;
}

const JigsawPuzzle: React.FC = () => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const gridSize = 3; // 3x3 grid
  const pieceSize = 100; // 100px by 100px pieces
  const imageSrc = "https://localhost:7058/api/Rooms/1/image"; // Replace with your image URL
  const snapThreshold = 100; // Snap into place if within 15px of correct position

  useEffect(() => {
    // Initialize puzzle pieces
    const newPieces: PuzzlePiece[] = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        newPieces.push({
          id: row * gridSize + col,
          x: Math.random() * 200 + 50, // Random start positions
          y: Math.random() * 200 + 50,
          correctX: col * pieceSize,
          correctY: row * pieceSize,
          imageSrc: `${imageSrc}#crop=${col * pieceSize},${row * pieceSize},${pieceSize},${pieceSize}`, // Optional crop logic
        });
      }
    }
    setPieces(newPieces);
  }, []);

  const handleDrag = (id: number, dx: number, dy: number) => {
    const dragSpeedFactor = 0.1; // Reduce movement speed
    setPieces((prevPieces) =>
      prevPieces.map((piece) =>
        piece.id === id
          ? {
              ...piece,
              x: piece.x + dx * dragSpeedFactor,
              y: piece.y + dy * dragSpeedFactor,
            }
          : piece
      )
    );
  };

  const handleDrop = (id: number) => {
    setPieces((prevPieces) =>
      prevPieces.map((piece) =>
        piece.id === id
          ? {
              ...piece,
              x: Math.abs(piece.x - piece.correctX) < snapThreshold
                ? piece.correctX
                : piece.x,
              y: Math.abs(piece.y - piece.correctY) < snapThreshold
                ? piece.correctY
                : piece.y,
            }
          : piece
      )
    );
  };

  const isPuzzleSolved = pieces.every(
    (piece) => piece.x === piece.correctX && piece.y === piece.correctY
  );

  return (
    <><h2>tohle je pain</h2>
    <div style={{ position: "relative", width: 300, height: 300, border: "1px solid black" }}>
        
      {isPuzzleSolved && <h2>Puzzle Solved!</h2>}
      {pieces.map((piece) => (
        <DraggablePiece
          key={piece.id}
          piece={piece}
          onDrag={handleDrag}
          onDrop={handleDrop}
          pieceSize={pieceSize}
          gridSize={gridSize}
        />
      ))}
    </div></>
    
  );
};

interface DraggablePieceProps {
  piece: PuzzlePiece;
  onDrag: (id: number, dx: number, dy: number) => void;
  onDrop: (id: number) => void;
  pieceSize: number;
  gridSize: number;
}

const DraggablePiece: React.FC<DraggablePieceProps> = ({
  piece,
  onDrag,
  onDrop,
  pieceSize,
  gridSize,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setOffset({ x: e.clientX - piece.x, y: e.clientY - piece.y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - offset.x - piece.x;
      const dy = e.clientY - offset.y - piece.y;
      onDrag(piece.id, dx, dy);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onDrop(piece.id);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        width: pieceSize,
        height: pieceSize,
        backgroundImage: `url(${piece.imageSrc})`,
        backgroundSize: `${pieceSize * gridSize}px ${pieceSize * gridSize}px`,
        backgroundPosition: `-${piece.correctX}px -${piece.correctY}px`,
        left: piece.x,
        top: piece.y,
        cursor: "grab",
      }}
    ></div>
  );
};

export default JigsawPuzzle;
     
