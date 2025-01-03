import React, { useState, useEffect } from "react";

type Item = {
  itemId: number;
  name: string;
  description: string;
  action: string | null;
  target: string | null;
};

const ItemsList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("https://localhost:7058/api/Items");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: Item[] = await response.json();
        setItems(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (items.length === 0) {
    return <div>No items available.</div>;
  }

  return (
    <div>
      <h1>Items List</h1>
      <ul>
        {items.map((item) => (
          <li key={item.itemId}>
            <h2>{item.name}</h2>
            <p><strong>Id:</strong> {item.itemId}</p>
            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Action:</strong> {item.action || "None"}</p>
            <p><strong>Target:</strong> {item.target || "None"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemsList;
