import { Injectable } from '@nestjs/common';

import type {
  GameModifier,
  GameSettings,
  Lobby,
  Player,
} from './lobby.types';

@Injectable()
export class LobbyService {
  private readonly lobbies =
    new Map<string, Lobby>();

  createLobby(
    socketId: string,
    nickname: string,
  ): Lobby {
    const code =
      this.generateCode();

    const player: Player = {
      id: socketId,
      nickname,
      isHost: true,

      drawingFinished: false,

      score: 0,
    };

const lobby: Lobby = {
  code,
  hostId: socketId,

  players: [
    player,
  ],

  state: 'waiting',

  round: 0,

  totalRounds: 5,

  settings: {
    rounds: 5,

    drawingTime: 30,

    modifiers: [
      'normal',
    ],
  },
};

    this.lobbies.set(
      code,
      lobby,
    );

    return lobby;
  }

  joinLobby(
    code: string,
    socketId: string,
    nickname: string,
  ): Lobby | null {
    const lobby =
      this.lobbies.get(
        code,
      );

    if (!lobby) {
      return null;
    }

    /*
     * Plus tard on pourra
     * interdire l'entrée
     * lorsqu'une partie
     * est déjà lancée.
     */
    if (
      lobby.state ===
      'playing'
    ) {
      return null;
    }

    const existingPlayer =
      lobby.players.find(
        (player) =>
          player.id ===
          socketId,
      );

    if (
      !existingPlayer
    ) {
      const player: Player = {
        id: socketId,
        nickname,

        isHost: false,

        drawingFinished:
          false,

        score: 0,
      };

      lobby.players.push(
        player,
      );
    }

    return lobby;
  }

  getLobby(
    code: string,
  ): Lobby | undefined {
    return this.lobbies.get(
      code,
    );
  }

  removePlayer(
    socketId: string,
  ): Lobby | null {
    for (
      const [
        code,
        lobby,
      ] of this.lobbies
    ) {
      const playerIndex =
        lobby.players.findIndex(
          (player) =>
            player.id ===
            socketId,
        );

      if (
        playerIndex === -1
      ) {
        continue;
      }

      const wasHost =
        lobby.hostId ===
        socketId;

      lobby.players.splice(
        playerIndex,
        1,
      );

      /*
       * Plus personne :
       * suppression du lobby.
       */
      if (
        lobby.players
          .length === 0
      ) {
        this.lobbies.delete(
          code,
        );

        return null;
      }

      /*
       * Le host quitte :
       * on transfère le host
       * au premier joueur
       * restant.
       */
      if (wasHost) {
        lobby.hostId =
          lobby.players[0]
            .id;

        lobby.players =
          lobby.players.map(
            (
              player,
              index,
            ) => ({
              ...player,

              isHost:
                index === 0,
            }),
          );
      }

      return lobby;
    }

    return null;
  }

updateSettings(
  code: string,
  socketId: string,
  settings: GameSettings,
): Lobby | null {
  const lobby =
    this.lobbies.get(code);

  if (!lobby) {
    return null;
  }

  if (
    lobby.hostId !==
    socketId
  ) {
    return null;
  }

  if (
    lobby.state !==
    'waiting'
  ) {
    return null;
  }

  const rounds =
    Math.min(
      10,
      Math.max(
        3,
        settings.rounds,
      ),
    );

  const allowedTimes = [
    10,
    20,
    30,
    45,
    60,
  ];

  const drawingTime =
    allowedTimes.includes(
      settings.drawingTime,
    )
      ? settings.drawingTime
      : 30;

const modifiers: GameModifier[] =
  settings.modifiers.length > 0
    ? settings.modifiers
    : ['normal'];

  lobby.settings = {
    rounds,
    drawingTime,
    modifiers,
  };

  lobby.totalRounds =
    rounds;

  return lobby;
}

  private generateCode(): string {
    let code: string;

    do {
      code = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
    } while (
      this.lobbies.has(
        code,
      )
    );

    return code;
  }
}