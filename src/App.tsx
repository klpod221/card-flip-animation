import "./App.css";

import SneakCard from "./SneakCard";
import { CardName, Suit } from "./types/card";
import { DragProvider } from "./context/TouchContext/DragContext";

function App() {
  return (
    <div className="App">
      <DragProvider>
        {Object.values(CardName).map((cardName) => {
          return (
            <SneakCard
              card={{
                name: cardName,
                suit: Suit.Hearts,
                value: 1,
                isFacingDown: true,
                isSentToPlayer: false,
              }}
              onCardRevealed={() => {}}
              onCardRevealing={() => {}}
              key={cardName}
            />
          );
        })}
      </DragProvider>
    </div>
  );
}

export default App;
