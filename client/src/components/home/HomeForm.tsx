type HomeFormProps = {
  nickname: string;
  setNickname: (value: string) => void;

  lobbyCode: string;
  setLobbyCode: (value: string) => void;

  createLobby: () => void;
  joinLobby: () => void;

  error?: string;
};

export default function HomeForm({
  nickname,
  setNickname,
  lobbyCode,
  setLobbyCode,
  createLobby,
  joinLobby,
  error,
}: HomeFormProps) {
  return (
    <div
      className="
        w-full
        max-w-md
        rounded-3xl
        border
        border-[#9b5cff]/50
        bg-[#11131f]/85
        p-8
        shadow-2xl
        backdrop-blur-md
      "
    >
      <h1 className="mb-8 text-4xl font-bold text-white">
        Draw Impostor
      </h1>

      <div className="mb-5 text-left">
        <label
          htmlFor="nickname"
          className="mb-2 block text-sm font-medium text-[#c7c9d8]"
        >
          Pseudo
        </label>

        <input
          id="nickname"
          value={nickname}
          onChange={(event) =>
            setNickname(event.target.value)
          }
          placeholder="Louis"
          className="
            w-full
            rounded-xl
            border
            border-white/10
            bg-[#1b1f2e]
            px-4
            py-3
            text-white
            outline-none
            placeholder:text-[#74798d]
            focus:border-[#9b5cff]
            focus:ring-2
            focus:ring-[#9b5cff]/30
          "
        />
      </div>

      <button
        onClick={createLobby}
        className="
          w-full
          rounded-xl
          bg-[#9b5cff]
          px-4
          py-3
          font-semibold
          text-white
          transition
          hover:bg-[#b479ff]
          hover:scale-[1.02]
        "
      >
        Créer un lobby
      </button>

      <div className="my-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-sm text-[#74798d]">
          OU
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="mb-5 text-left">
        <label
          htmlFor="lobbyCode"
          className="mb-2 block text-sm font-medium text-[#c7c9d8]"
        >
          Code du lobby
        </label>

        <input
          id="lobbyCode"
          value={lobbyCode}
          onChange={(event) =>
            setLobbyCode(
              event.target.value.toUpperCase(),
            )
          }
          placeholder="ABC123"
          className="
            w-full
            rounded-xl
            border
            border-white/10
            bg-[#1b1f2e]
            px-4
            py-3
            text-center
            font-mono
            tracking-[0.25em]
            text-white
            outline-none
            placeholder:text-[#74798d]
            focus:border-[#36d8ff]
            focus:ring-2
            focus:ring-[#36d8ff]/30
          "
        />
      </div>

      <button
        onClick={joinLobby}
        className="
          w-full
          rounded-xl
          bg-[#36d8ff]
          px-4
          py-3
          font-semibold
          text-[#10131c]
          transition
          hover:bg-[#67e5ff]
          hover:scale-[1.02]
        "
      >
        Rejoindre le lobby
      </button>

      {error && (
        <p className="mt-5 text-sm text-[#ff6b8a]">
          {error}
        </p>
      )}
    </div>
  );
}