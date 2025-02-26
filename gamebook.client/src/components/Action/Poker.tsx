import React, { useState, useEffect } from "react";
import { set } from "react-hook-form";

interface Card {
  suit: string;
  value: string;
}

interface Player {
  id: number;
  name: string;
  chips: number;
  bet: number;
  hand: Card[];
  folded: boolean;
}

const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

const createDeck = (): Card[] => {
  let deck: Card[] = [];
  suits.forEach(suit => {
    values.forEach(value => {
      deck.push({ suit, value });
    });
  });
  return deck.sort(() => Math.random() - 0.5);
};

const TexasHoldEm = () => {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "You", chips: 1000, hand: [], folded: false, bet: 0 },
    { id: 2, name: "Bot 1", chips: 1000, hand: [], folded: false , bet: 0},
    { id: 3, name: "Bot 2", chips: 1000, hand: [], folded: false , bet: 0},
    { id: 4, name: "Bot 3", chips: 1000, hand: [], folded: false , bet: 0},
    { id: 5, name: "Bot 4", chips: 1000, hand: [], folded: false, bet: 0 },
    { id: 6, name: "Bot 5", chips: 1000, hand: [], folded: false , bet: 0},
  ]);
  const [communityCards, setCommunityCards] = useState<Card[]>([]);
  const [pot, setPot] = useState(0);
  const [deck, setDeck] = useState<Card[]>(createDeck());
  const [handsDealt, setHandsDealt] = useState(false);
  const [turn, setTurn] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [lastPot, setLastPot] = useState(0);
  const [phase, setPhase] = useState("preflop");

  const dealHands = () => {
    let newDeck = [...deck];
    const newPlayers = players.map(player => ({
      ...player,
      hand: [newDeck.pop()!, newDeck.pop()!],
      folded: false,
    }));
    setPlayers(newPlayers);
    setDeck(newDeck);
    setHandsDealt(true);
    setTurn(0);
    setRounds(0);
    setLastPot(pot);
    setPhase("preflop");
  };

  const nextPhase = () => {
    let newDeck = [...deck];
    if (phase === "preflop") {
      setCommunityCards([newDeck.pop()!, newDeck.pop()!, newDeck.pop()!]);
      setPhase("flop");
    } else if (phase === "flop") {
      setCommunityCards([...communityCards, newDeck.pop()!]);
      setPhase("turn");
    } else if (phase === "turn") {
      setCommunityCards([...communityCards, newDeck.pop()!]);
      setPhase("river");
    } else if (phase === "river") {
        console.log("Showdown");
        let winningPlayer = players[0];
        let winningHand = 0;
        players.forEach(player => {
            const hand = [...player.hand, ...communityCards];
            let handValue = 0;
            hand.forEach(card => {
            handValue += values.indexOf(card.value);
            });
            if (handValue > winningHand) {
            winningPlayer = player;
            winningHand = handValue;
            }
        });
        winningPlayer.chips += pot;
        setPlayers(players.map(player => ({ ...player, hand: [], folded: false })));
        setCommunityCards([]);
        setPot(0);
        setHandsDealt(false);
        setPhase("preflop");
        setDeck(createDeck());
        return;
    }
    setPlayers(players.map(player => ({ ...player, bet: 0 })));
    setDeck(newDeck);
    setRounds(0);
    console.log("Phase ends");
    setLastPot(pot);
    setTurn(0);
  };

  const nextTurn = () => {
    let next = (turn + 1) % players.length;
    while (players[next].folded) {
      next = (next + 1) % players.length;
    }
    if (next === 0) {
      setRounds(prev => prev + 1);
      if (rounds >= 2 || pot === lastPot) {
        console.log("Round ends");
        nextPhase();
        return;
      }
      setLastPot(pot);
    }
    setTurn(next);
  };

  useEffect(() => {
    if (handsDealt && turn !== 0) {
      setTimeout(() => {
        const botAction = Math.random();
        const newPlayers = [...players];
        
        if (botAction < 0.5) {
          console.log(`${newPlayers[turn].name} checks`);
        } else if (botAction < 0.7) {
          console.log(`${newPlayers[turn].name} folds`);
          newPlayers[turn].folded = true;
        } else {
          console.log(`${newPlayers[turn].name} bets`);
            newPlayers[turn].bet += 10;
            newPlayers[turn].chips -= 10;
          setPot(prev => prev + 10);
        }
        setPlayers(newPlayers);
        nextTurn();
      }, 200);
    }
  }, [turn, handsDealt]);

  return (
    <div style={{ padding: "16px", backgroundColor: "#228B22", minHeight: "100vh", color: "white", textAlign: "center", position: "relative" }}>
      <h1>Texas Hold 'Em</h1>
      {phase}
      {communityCards.length > 0 && communityCards.map((card, index) => (
        <div key={index} style={{ padding: "8px", border: "1px solid black", backgroundColor: "white", color: "black", display: "inline-block", margin: "8px" }}>
          {card.value} of {card.suit}
        </div>
      ))}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "24px" }}>Pot: ${pot}</div>
      <div style={{ position: "relative", width: "400px", height: "400px", margin: "auto", borderRadius: "50%", border: "2px solid white" }}>
        {players.map((player, index) => {
          const angle = (index / players.length) * (2 * Math.PI);
          const x = Math.cos(angle) * 180 + 180;
          const y = Math.sin(angle) * 180 + 180;
          return (
            <div key={player.id} style={{ position: "absolute", left: `${x}px`, top: `${y}px`, textAlign: "center" }}>
              <strong>{player.name}</strong>
              <p>{player.chips}</p>
              <p>{player.bet}</p>
              {turn === index && <span style={{ color: "red", marginLeft: "5px" }}>⬤</span>}
              {player.folded && <span> (Folded) </span>}
              <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                {handsDealt && (player.folded || player.id === 1
                  ? player.hand.map((card, index) => (
                      <div key={index} style={{ padding: "8px", border: "1px solid black", backgroundColor: "white", color: "black" }}>
                        {card.value} of {card.suit}
                      </div>
                    ))
                  : ["?", "?"].map((_, index) => (
                      <div key={index} style={{ padding: "8px", border: "1px solid black", backgroundColor: "gray", color: "black" }}>?</div>
                    )))}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: "100px" }}>
        {!handsDealt ? (
          <button onClick={dealHands}>Deal Hands</button>
        ) : (
          turn === 0 && (
            <>
              <button onClick={nextTurn}>Check</button>
              <button onClick={() => {
                const newPlayers = [...players];
                newPlayers[0].folded = true;
                setPlayers(newPlayers);
                nextTurn();
              }}>Fold</button>
              <button onClick={() => {
                players[turn].bet += 10;
                players[turn].chips -= 10;
                setPot(prev => prev + 10);
                nextTurn();
              }}>Bet</button>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default TexasHoldEm;
