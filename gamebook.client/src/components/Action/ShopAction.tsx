import React, { useEffect, useState } from "react";
import { ApiBaseUrl } from "../../EnvFile";
import { useGameContext } from "../../GameProvider";
import { Item } from "../../types/types2";
import styles from "./ShopAction.module.css";


const Shop: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { player, money, setMoney, setPlayerItems } = useGameContext();

const HandleBuy = (e: Item) => {
  if (e.price !== null && (e.price ?? 0) < money) {
    setMoney(money - (e.price ?? 0));
    setPlayerItems((prevItems: Item[]) => {
      const existingItem = prevItems.find((i) => i.itemId === e.itemId);
      if (existingItem) {
        return prevItems.map((i) =>
          i.itemId === e.itemId ? { ...i, quantity: (i.quantity ?? 0) + 1 } : i
        );
      }
      return [...prevItems, { ...e, quantity: 1 }];
    });
  }

}

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
    <div className={styles.container}>
      <h2>Shop</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
        {items.length > 0 ? (
          items.map(item => (
            <div className={styles.card} key={item.itemId} >
              <div className={styles.itemInfo}>
                <img src={`${ApiBaseUrl}${item.imgUrl}`} alt={item.name} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
              <div className={styles.itemActions}>
                <p><strong>Price: {item.price} Krejcarů</strong></p>
                <button className={styles.button} onClick={() => HandleBuy(item)} >
                  Buy
                </button>
              </div>
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
