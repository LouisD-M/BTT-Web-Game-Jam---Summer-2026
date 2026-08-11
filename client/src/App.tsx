import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/lobby/:id" element={<LobbyPage />} />
      <Route path="/game/:id" element={<GamePage />} />
    </Routes>
  );
}