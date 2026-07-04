import { useEventStore } from "./hooks/useEventStore";
import { SetupFlow } from "./components/setup/SetupFlow";
import { GameView } from "./components/game/GameView";

function App() {
  const { event, createEvent, setMatchScore, finishEvent, resetEvent } = useEventStore();

  if (!event) {
    return <SetupFlow onComplete={createEvent} />;
  }

  return <GameView event={event} onSetScore={setMatchScore} onFinish={finishEvent} onReset={resetEvent} />;
}

export default App;
