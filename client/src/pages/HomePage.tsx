import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket/socket";
import type { Lobby } from "../types/lobby";
import HomeForm from '../components/home/HomeForm';

export default function HomePage() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [lobbyCode, setLobbyCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleConnect = () => {
      console.log("Socket connecté :", socket.id);
    };

    const handleDisconnect = () => {
      console.log("Socket déconnecté");
    };

    const handleLobbyCreated = (lobby: Lobby) => {
      console.log("Lobby créé :", lobby);

      navigate(`/lobby/${lobby.code}`);
    };

    const handleLobbyUpdate = (lobby: Lobby) => {
      console.log("Lobby rejoint :", lobby);

      navigate(`/lobby/${lobby.code}`);
    };

    const handleLobbyError = (data: { message: string }) => {
      console.error("Erreur lobby :", data.message);

      setError(data.message);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("lobby:created", handleLobbyCreated);
    socket.on("lobby:update", handleLobbyUpdate);
    socket.on("lobby:error", handleLobbyError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("lobby:created", handleLobbyCreated);
      socket.off("lobby:update", handleLobbyUpdate);
      socket.off("lobby:error", handleLobbyError);
    };
  }, [navigate]);

  const createLobby = () => {
    if (!nickname.trim()) {
      setError("Entre un pseudo");
      return;
    }

    console.log("Création lobby...");
    console.log("Socket connecté ?", socket.connected);
    console.log("Socket ID :", socket.id);

    localStorage.setItem(
      "nickname",
      nickname.trim(),
    );

    socket.emit("lobby:create", {
      nickname: nickname.trim(),
    });
  };

  const joinLobby = () => {
    if (!nickname.trim()) {
      setError("Entre un pseudo");
      return;
    }

    if (!lobbyCode.trim()) {
      setError("Entre le code du lobby");
      return;
    }

    localStorage.setItem(
      "nickname",
      nickname.trim(),
    );

    socket.emit("lobby:join", {
      code: lobbyCode.trim().toUpperCase(),
      nickname: nickname.trim(),
    });
  };

  return (
<main
  className="
    flex
    min-h-screen
    w-full
    items-center
    justify-center
    bg-[url('/bg_homepage.png')]
    bg-cover
    bg-center
    bg-no-repeat
    p-6
  "
>
  <HomeForm
    nickname={nickname}
    setNickname={setNickname}
    lobbyCode={lobbyCode}
    setLobbyCode={setLobbyCode}
    createLobby={createLobby}
    joinLobby={joinLobby}
    error={error}
  />
</main>
  );
}