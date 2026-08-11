import { useState } from "react";

type GameSettingsModalProps = {
  onClose: () => void;
};

export default function GameSettingsModal({
  onClose,
}: GameSettingsModalProps) {
  const [rounds, setRounds] = useState(5);
  const [drawingTime, setDrawingTime] = useState(30);

  const [normal, setNormal] = useState(true);
  const [twoColors, setTwoColors] = useState(true);
  const [oneStroke, setOneStroke] = useState(true);
  const [reverseMouse, setReverseMouse] = useState(true);
  const [speedDraw, setSpeedDraw] = useState(true);
  const [blindDraw, setBlindDraw] = useState(false);
  const [sharedCanvas, setSharedCanvas] = useState(false);

  const saveSettings = () => {
    console.log({
      rounds,
      drawingTime,
      modifiers: {
        normal,
        twoColors,
        oneStroke,
        reverseMouse,
        speedDraw,
        blindDraw,
        sharedCanvas,
      },
    });

    onClose();
  };

  return (
    <div>
      <div>
        <h2>Options de la partie</h2>

        <div>
          <label htmlFor="rounds">
            Nombre de manches
          </label>

          <select
            id="rounds"
            value={rounds}
            onChange={(event) =>
              setRounds(Number(event.target.value))
            }
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={7}>7</option>
            <option value={10}>10</option>
          </select>
        </div>

        <div>
          <label htmlFor="drawingTime">
            Temps de dessin
          </label>

          <select
            id="drawingTime"
            value={drawingTime}
            onChange={(event) =>
              setDrawingTime(Number(event.target.value))
            }
          >
            <option value={10}>10 secondes</option>
            <option value={20}>20 secondes</option>
            <option value={30}>30 secondes</option>
            <option value={45}>45 secondes</option>
            <option value={60}>60 secondes</option>
          </select>
        </div>

        <h3>Règles disponibles</h3>

        <label>
          <input
            type="checkbox"
            checked={normal}
            onChange={(event) =>
              setNormal(event.target.checked)
            }
          />
          Normal
        </label>

        <label>
          <input
            type="checkbox"
            checked={twoColors}
            onChange={(event) =>
              setTwoColors(event.target.checked)
            }
          />
          Deux couleurs
        </label>

        <label>
          <input
            type="checkbox"
            checked={oneStroke}
            onChange={(event) =>
              setOneStroke(event.target.checked)
            }
          />
          Un seul trait
        </label>

        <label>
          <input
            type="checkbox"
            checked={reverseMouse}
            onChange={(event) =>
              setReverseMouse(event.target.checked)
            }
          />
          Souris inversée
        </label>

        <label>
          <input
            type="checkbox"
            checked={speedDraw}
            onChange={(event) =>
              setSpeedDraw(event.target.checked)
            }
          />
          Speed Draw
        </label>

        <label>
          <input
            type="checkbox"
            checked={blindDraw}
            onChange={(event) =>
              setBlindDraw(event.target.checked)
            }
          />
          Dessin à l'aveugle
        </label>

        <label>
          <input
            type="checkbox"
            checked={sharedCanvas}
            onChange={(event) =>
              setSharedCanvas(event.target.checked)
            }
          />
          Canvas partagé
        </label>

        <hr />

        <button onClick={saveSettings}>
          Sauvegarder
        </button>

        <button onClick={onClose}>
          Annuler
        </button>
      </div>
    </div>
  );
}