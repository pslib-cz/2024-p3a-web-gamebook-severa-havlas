import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const RoomDetail: React.FC = () => {
  const room = useParams(); // Načte parametr id z URL
  interface RoomData {
    name: string;
    text: string;
    img: string;
  }

  const [data, setData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(room.id);
    if (!room.id) {
      setError('ID is missing');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`https://localhost:7058/api/rooms/${room.id}` ,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
        } ) ;
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setData(data);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [room.id]); // Když se změní id v URL, znovu se spustí useEffect

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {data && (
        <div>
          <h1>{data.name}</h1>
          <p>{data.text}</p>
          <img src={`data:image/png;base64,${data.img}`} alt={data.name} />
        </div>
      )}
    </div>
  );
};

export default RoomDetail;
