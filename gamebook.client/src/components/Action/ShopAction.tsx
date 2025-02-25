import React, { useEffect, useState } from "react";
import { ApiBaseUrl } from "../../EnvFile";

interface Item {
  itemId: number;
  name: string;
  description: string;
  imgUrl: string;
  price: number | null;
}

const Shop: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${ApiBaseUrl}/api/Items`);
        if (!response.ok) throw new Error("Failed to fetch items");
        
        const data: Item[] = await response.json();
        setItems(data.filter(item => item.price !== null)); // Filter items with a price
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <p>Loading shop items...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Shop</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
        {items.length > 0 ? (
          items.map(item => (
            <div key={item.itemId} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px", textAlign: "center" }}>
              <img src={`${ApiBaseUrl}${item.imgUrl}`} alt={item.name} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p><strong>Price: {item.price} Gold</strong></p>
              <button style={{ padding: "5px 10px", cursor: "pointer", background: "green", color: "white", border: "none", borderRadius: "5px" }}>
                Buy
              </button>
            </div>
          ))
        ) : (
          <p>No items available for purchase.</p>
        )}
      </div>
    </div>
  );
};

export default Shop;
