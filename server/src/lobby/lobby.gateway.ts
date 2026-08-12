import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type {
  GameModifier,
  GameSettings,
} from './lobby.types';

import {
  Server,
  Socket,
} from 'socket.io';

import { LobbyService } from './lobby.service';
import { WORD_PAIRS } from '../game/word-pairs';
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class LobbyGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  /*
   * Un seul timer actif par phase et par lobby.
   *
   * Ça permet de nettoyer proprement
   * tous les timers quand une phase
   * se termine plus tôt.
   */
  private readonly drawingTimers =
    new Map<string, NodeJS.Timeout>();

  private readonly reviewTimers =
    new Map<string, NodeJS.Timeout>();

  private readonly votingTimers =
    new Map<string, NodeJS.Timeout>();

  private readonly resultsTimers =
    new Map<string, NodeJS.Timeout>();

  constructor(
    private readonly lobbyService: LobbyService,
  ) {}

  handleConnection(
    socket: Socket,
  ) {
    console.log(
      'Socket connecté :',
      socket.id,
    );
  }

  handleDisconnect(
    socket: Socket,
  ) {
    console.log(
      'Socket déconnecté :',
      socket.id,
    );

    const lobby =
      this.lobbyService.removePlayer(
        socket.id,
      );

    if (!lobby) {
      return;
    }

    this.server
      .to(lobby.code)
      .emit(
        'lobby:update',
        lobby,
      );
  }

  // =====================================================
  // LOBBY
  // =====================================================

  @SubscribeMessage('lobby:create')
  handleCreateLobby(
    @ConnectedSocket()
    socket: Socket,

    @MessageBody()
    data: {
      nickname: string;
    },
  ) {
    const lobby =
      this.lobbyService.createLobby(
        socket.id,
        data.nickname,
      );

    socket.join(
      lobby.code,
    );

    socket.emit(
      'lobby:created',
      lobby,
    );
  }

  @SubscribeMessage('lobby:join')
  handleJoinLobby(
    @ConnectedSocket()
    socket: Socket,

    @MessageBody()
    data: {
      code: string;
      nickname: string;
    },
  ) {
    const code =
      data.code.toUpperCase();

    const lobby =
      this.lobbyService.joinLobby(
        code,
        socket.id,
        data.nickname,
      );

    if (!lobby) {
      socket.emit(
        'lobby:error',
        {
          message:
            'Lobby introuvable',
        },
      );

      return;
    }

    socket.join(code);

    this.server
      .to(code)
      .emit(
        'lobby:update',
        lobby,
      );
  }

@SubscribeMessage('settings:update')
handleSettingsUpdate(
  @ConnectedSocket()
  socket: Socket,

  @MessageBody()
  data: {
    code: string;
    settings: GameSettings;
  },
) {
  const code =
    data.code.toUpperCase();

  const lobby =
    this.lobbyService.updateSettings(
      code,
      socket.id,
      data.settings,
    );

  if (!lobby) {
    socket.emit(
      'lobby:error',
      {
        message:
          'Impossible de modifier les options',
      },
    );

    return;
  }

  this.server
    .to(code)
    .emit(
      'lobby:update',
      lobby,
    );
}

  @SubscribeMessage('avatar:update')
handleAvatarUpdate(
  @ConnectedSocket()
  socket: Socket,

  @MessageBody()
  data: {
    code: string;
    avatar: string;
  },
) {
  const code =
    data.code.toUpperCase();

  const lobby =
    this.lobbyService.getLobby(
      code,
    );

  if (!lobby) {
    return;
  }

  const player =
    lobby.players.find(
      (player) =>
        player.id === socket.id,
    );

  if (!player) {
    return;
  }

  player.avatar =
    data.avatar;

  this.server
    .to(code)
    .emit(
      'lobby:update',
      lobby,
    );
}

  @SubscribeMessage('lobby:get')
  handleGetLobby(
    @ConnectedSocket()
    socket: Socket,

    @MessageBody()
    data: {
      code: string;
    },
  ) {
    const lobby =
      this.lobbyService.getLobby(
        data.code.toUpperCase(),
      );

    if (!lobby) {
      socket.emit(
        'lobby:error',
        {
          message:
            'Lobby introuvable',
        },
      );

      return;
    }

    socket.emit(
      'lobby:update',
      lobby,
    );
  }

  // =====================================================
  // START GAME
  // =====================================================

  @SubscribeMessage('game:start')
  handleStartGame(
    @ConnectedSocket()
    socket: Socket,

    @MessageBody()
    data: {
      code: string;
    },
  ) {
    const code =
      data.code.toUpperCase();

    const lobby =
      this.lobbyService.getLobby(
        code,
      );

    if (!lobby) {
      return;
    }

    if (
      lobby.hostId !==
      socket.id
    ) {
      return;
    }

    if (
      lobby.players.length < 3
    ) {
      socket.emit(
        'lobby:error',
        {
          message:
            'Il faut au minimum 3 joueurs',
        },
      );

      return;
    }

    /*
     * Sécurité :
     * on supprime d'éventuels
     * anciens timers.
     */
    this.clearAllTimers(
      code,
    );

    lobby.state =
      'playing';

    lobby.round = 0;

    for (
      const player
      of lobby.players
    ) {
      player.score = 0;

      player.drawingFinished =
        false;

      player.drawing =
        undefined;

      player.voteFor =
        undefined;
    }

    this.server
      .to(code)
      .emit(
        'game:started',
        {
          code,
        },
      );

    this.startRound(
      code,
    );
  }

  // =====================================================
  // DRAWING FINISHED
  // =====================================================

  @SubscribeMessage(
    'drawing:finished',
  )
  handleDrawingFinished(
    @ConnectedSocket()
    socket: Socket,

    @MessageBody()
    data: {
      code: string;
      drawing: string;
    },
  ) {
    const code =
      data.code.toUpperCase();

    const lobby =
      this.lobbyService.getLobby(
        code,
      );

    if (!lobby) {
      return;
    }

    if (
      lobby.phase !==
      'drawing'
    ) {
      return;
    }

    const player =
      lobby.players.find(
        (player) =>
          player.id ===
          socket.id,
      );

    if (!player) {
      return;
    }

    /*
     * Évite un double envoi.
     */
    if (
      player.drawingFinished
    ) {
      return;
    }

    player.drawingFinished =
      true;

    player.drawing =
      data.drawing;

    const finishedCount =
      lobby.players.filter(
        (player) =>
          player.drawingFinished,
      ).length;

    this.server
      .to(code)
      .emit(
        'drawing:status',
        {
          finished:
            finishedCount,

          total:
            lobby.players.length,
        },
      );

    const everybodyFinished =
      lobby.players.every(
        (player) =>
          player.drawingFinished,
      );

    /*
     * Tout le monde a terminé :
     * inutile d'attendre la fin
     * du timer dessin.
     */
    if (
      everybodyFinished
    ) {
      this.clearDrawingTimer(
        code,
      );

      this.startReview(
        code,
      );
    }
  }

  // =====================================================
  // VOTE
  // =====================================================

  @SubscribeMessage(
    'vote:submit',
  )
  handleVote(
    @ConnectedSocket()
    socket: Socket,

    @MessageBody()
    data: {
      code: string;
      playerId: string;
    },
  ) {
    const code =
      data.code.toUpperCase();

    const lobby =
      this.lobbyService.getLobby(
        code,
      );

    if (!lobby) {
      return;
    }

    if (
      lobby.phase !==
      'voting'
    ) {
      return;
    }

    const voter =
      lobby.players.find(
        (player) =>
          player.id ===
          socket.id,
      );

    if (!voter) {
      return;
    }

    /*
     * Un seul vote par joueur.
     */
    if (voter.voteFor) {
      return;
    }

    /*
     * Impossible de voter
     * contre soi-même.
     */
    if (
      data.playerId ===
      socket.id
    ) {
      return;
    }

    const targetExists =
      lobby.players.some(
        (player) =>
          player.id ===
          data.playerId,
      );

    if (!targetExists) {
      return;
    }

    voter.voteFor =
      data.playerId;

    const votedCount =
      lobby.players.filter(
        (player) =>
          !!player.voteFor,
      ).length;

    this.server
      .to(code)
      .emit(
        'vote:status',
        {
          voted:
            votedCount,

          total:
            lobby.players.length,
        },
      );

    const everybodyVoted =
      lobby.players.every(
        (player) =>
          !!player.voteFor,
      );

    /*
     * Tout le monde a voté :
     * on supprime immédiatement
     * le timer de vote.
     */
    if (
      everybodyVoted
    ) {
      this.clearVotingTimer(
        code,
      );

      this.finishRound(
        code,
      );
    }
  }

// =====================================================
// GET CURRENT GAME STATE
// =====================================================


@SubscribeMessage('game:get-state')
handleGetGameState(
  @ConnectedSocket()
  socket: Socket,

  @MessageBody()
  data: {
    code: string;
  },
) {
  const code =
    data.code.toUpperCase();

  const lobby =
    this.lobbyService.getLobby(
      code,
    );

  if (!lobby) {
    return;
  }

  if (
    lobby.state !== 'playing'
  ) {
    return;
  }

  const player =
    lobby.players.find(
      (player) =>
        player.id ===
        socket.id,
    );

  if (!player) {
    return;
  }

  const currentModifier =
    lobby.currentModifier ??
    'normal';

  const drawingDuration =
    currentModifier ===
    'speedDraw'
      ? 10
      : lobby.settings
          .drawingTime;

  socket.emit(
    'round:started',
    {
      round:
        lobby.round,

      totalRounds:
        lobby.totalRounds,

      duration:
        drawingDuration,

      modifier:
        currentModifier,
    },
  );

  if (
    lobby.phase === 'drawing'
  ) {
    const word =
      player.id ===
      lobby.impostorId
        ? lobby.impostorWord
        : lobby.normalWord;

    socket.emit(
      'round:word',
      {
        word,

        rule:
          currentModifier,

        modifier:
          currentModifier,

        duration:
          drawingDuration,
      },
    );
  }
}

  // =====================================================
  // START ROUND
  // =====================================================

private startRound(
  code: string,
) {
  const lobby =
    this.lobbyService.getLobby(
      code,
    );

  if (!lobby) {
    return;
  }

  this.clearAllTimers(
    code,
  );

  lobby.round += 1;

  lobby.phase =
    'drawing';

const availableModifiers: GameModifier[] =
  lobby.settings.modifiers.length > 0
    ? lobby.settings.modifiers
    : ['normal'];

const randomModifier: GameModifier =
  availableModifiers[
    Math.floor(
      Math.random() *
        availableModifiers.length,
    )
  ];

lobby.currentModifier =
  randomModifier;

  const drawingDuration =
    lobby.currentModifier ===
    'speedDraw'
      ? 10
      : lobby.settings
          .drawingTime;

  const roundNumber =
    lobby.round;

  for (
    const player
    of lobby.players
  ) {
    player.drawingFinished =
      false;

    player.drawing =
      undefined;

    player.voteFor =
      undefined;
  }

  const randomIndex =
    Math.floor(
      Math.random() *
        lobby.players.length,
    );

  lobby.impostorId =
    lobby.players[
      randomIndex
    ].id;

  const randomPair =
    WORD_PAIRS[
      Math.floor(
        Math.random() *
          WORD_PAIRS.length,
      )
    ];

  lobby.normalWord =
    randomPair.normal;

  lobby.impostorWord =
    randomPair.impostor;

  console.log(
    `[${code}] Manche ${roundNumber} → DRAWING | ${lobby.currentModifier} | ${drawingDuration}s`,
  );

  this.server
    .to(code)
    .emit(
      'round:started',
      {
        round:
          lobby.round,

        totalRounds:
          lobby.totalRounds,

        duration:
          drawingDuration,

        modifier:
          lobby.currentModifier,
      },
    );

  for (
    const player
    of lobby.players
  ) {
    const word =
      player.id ===
      lobby.impostorId
        ? lobby.impostorWord
        : lobby.normalWord;

    this.server
      .to(player.id)
      .emit(
        'round:word',
        {
          word,

          rule:
            lobby.currentModifier,

          modifier:
            lobby.currentModifier,

          duration:
            drawingDuration,
        },
      );
  }

  const timer =
    setTimeout(() => {
      this.drawingTimers.delete(
        code,
      );

      const currentLobby =
        this.lobbyService.getLobby(
          code,
        );

      if (!currentLobby) {
        return;
      }

      if (
        currentLobby.round !==
        roundNumber
      ) {
        return;
      }

      if (
        currentLobby.phase !==
        'drawing'
      ) {
        return;
      }

      console.log(
        `[${code}] Fin dessin manche ${roundNumber}`,
      );

      this.startReview(
        code,
      );
    }, drawingDuration * 1000);

  this.drawingTimers.set(
    code,
    timer,
  );
}

  // =====================================================
  // REVIEW
  // =====================================================

  private startReview(
    code: string,
  ) {
    const lobby =
      this.lobbyService.getLobby(
        code,
      );

    if (!lobby) {
      return;
    }

    if (
      lobby.phase !==
      'drawing'
    ) {
      return;
    }

    /*
     * On tue définitivement
     * le timer dessin.
     */
    this.clearDrawingTimer(
      code,
    );

    lobby.phase =
      'review';

    const roundNumber =
      lobby.round;

    const drawings =
      lobby.players.map(
        (player) => ({
          id:
            player.id,

          nickname:
            player.nickname,
        avatar: player.avatar,

          drawing:
            player.drawing ??
            null,
        }),
      );

    console.log(
      `[${code}] Manche ${roundNumber} → REVIEW`,
    );

    this.server
      .to(code)
      .emit(
        'review:started',
        {
          drawings,
        },
      );

    /*
     * 4 secondes par dessin.
     *
     * 3 joueurs = 12 sec
     * 4 joueurs = 16 sec
     * 5 joueurs = 20 sec
     */
    const reviewDuration =
      Math.max(
        drawings.length *
          4000,
        4000,
      );

    const timer =
      setTimeout(() => {
        this.reviewTimers.delete(
          code,
        );

        const currentLobby =
          this.lobbyService.getLobby(
            code,
          );

        if (!currentLobby) {
          return;
        }

        if (
          currentLobby.round !==
          roundNumber
        ) {
          return;
        }

        if (
          currentLobby.phase !==
          'review'
        ) {
          return;
        }

        console.log(
          `[${code}] Manche ${roundNumber} REVIEW → VOTING`,
        );

        this.startVoting(
          code,
        );
      }, reviewDuration);

    this.reviewTimers.set(
      code,
      timer,
    );
  }

  // =====================================================
  // START VOTING
  // =====================================================

  private startVoting(
    code: string,
  ) {
    const lobby =
      this.lobbyService.getLobby(
        code,
      );

    if (!lobby) {
      return;
    }

    if (
      lobby.phase !==
      'review'
    ) {
      return;
    }

    /*
     * Le review est terminé :
     * son timer ne doit plus
     * pouvoir agir.
     */
    this.clearReviewTimer(
      code,
    );

    lobby.phase =
      'voting';

    const roundNumber =
      lobby.round;

    const drawings =
      lobby.players.map(
        (player) => ({
          id:
            player.id,

          nickname:
            player.nickname,
            avatar: player.avatar,

          drawing:
            player.drawing ??
            null,
        }),
      );

    console.log(
      `[${code}] Manche ${roundNumber} → VOTING`,
    );

    /*
     * 60 SECONDES POUR VOTER.
     */
    this.server
      .to(code)
      .emit(
        'voting:started',
        {
          duration: 60,

          players:
            lobby.players.map(
              (player) => ({
                id:
                  player.id,

                nickname:
                  player.nickname,

                avatar: player.avatar,
              }),
            ),

          drawings,
        },
      );

    const timer =
      setTimeout(() => {
        this.votingTimers.delete(
          code,
        );

        const currentLobby =
          this.lobbyService.getLobby(
            code,
          );

        if (!currentLobby) {
          return;
        }

        if (
          currentLobby.round !==
          roundNumber
        ) {
          return;
        }

        if (
          currentLobby.phase !==
          'voting'
        ) {
          return;
        }

        console.log(
          `[${code}] Fin vote manche ${roundNumber}`,
        );

        this.finishRound(
          code,
        );
      }, 60_000);

    this.votingTimers.set(
      code,
      timer,
    );
  }

  // =====================================================
  // FIN DE MANCHE / RESULTS
  // =====================================================

  private finishRound(
    code: string,
  ) {
    const lobby =
      this.lobbyService.getLobby(
        code,
      );

    if (!lobby) {
      return;
    }

    /*
     * Empêche finishRound()
     * d'être appelé deux fois.
     */
    if (
      lobby.phase !==
      'voting'
    ) {
      return;
    }

    /*
     * CRITIQUE :
     * dès qu'on quitte le vote,
     * son timer est détruit.
     */
    this.clearVotingTimer(
      code,
    );

    lobby.phase =
      'results';

    const roundNumber =
      lobby.round;

    const votes:
      Record<string, number> =
        {};

    for (
      const player
      of lobby.players
    ) {
      if (
        !player.voteFor
      ) {
        continue;
      }

      votes[
        player.voteFor
      ] =
        (
          votes[
            player.voteFor
          ] ?? 0
        ) + 1;
    }

    /*
     * SCORE MVP :
     *
     * +1 pour chaque joueur
     * qui trouve l'imposteur.
     */
/*
 * SCORE :
 *
 * Joueur normal :
 * +1 s'il vote pour l'imposteur.
 *
 * Imposteur :
 * +1 si personne ne vote contre lui.
 */

for (const player of lobby.players) {
  if (player.id === lobby.impostorId) {
    continue;
  }

  if (player.voteFor === lobby.impostorId) {
    player.score += 1;
  }
}

const impostorVotes =
  lobby.impostorId
    ? votes[lobby.impostorId] ?? 0
    : 0;

if (
  lobby.impostorId &&
  impostorVotes === 0
) {
  const impostor =
    lobby.players.find(
      (player) =>
        player.id === lobby.impostorId,
    );

  if (impostor) {
    impostor.score += 1;
  }
}

    const playerWords =
      lobby.players.map(
        (player) => ({
          id:
            player.id,

          nickname:
            player.nickname,

        avatar: player.avatar,

          word:
            player.id ===
            lobby.impostorId
              ? lobby.impostorWord
              : lobby.normalWord,

          isImpostor:
            player.id ===
            lobby.impostorId,

          score:
            player.score,

          votesReceived:
            votes[
              player.id
            ] ?? 0,
        }),
      );

    console.log(
      `[${code}] Manche ${roundNumber} → RESULTS`,
    );

    this.server
      .to(code)
      .emit(
        'round:results',
        {
          round:
            roundNumber,

          impostorId:
            lobby.impostorId,

          normalWord:
            lobby.normalWord,

          impostorWord:
            lobby.impostorWord,

          votes,

          playerWords,

          scores:
            lobby.players.map(
              (player) => ({
                id:
                  player.id,

                nickname:
                  player.nickname,

                avatar: player.avatar,

                score:
                  player.score,
              }),
            ),
        },
      );

    /*
     * On laisse 10 secondes
     * pour lire les résultats.
     */
    const timer =
      setTimeout(() => {
        this.resultsTimers.delete(
          code,
        );

        const currentLobby =
          this.lobbyService.getLobby(
            code,
          );

        if (!currentLobby) {
          return;
        }

        if (
          currentLobby.round !==
          roundNumber
        ) {
          return;
        }

        if (
          currentLobby.phase !==
          'results'
        ) {
          return;
        }

        /*
         * Fin de la partie.
         */
        if (
          currentLobby.round >=
          currentLobby.totalRounds
        ) {
          /*
           * Nettoyage total.
           */
          this.clearAllTimers(
            code,
          );

          currentLobby.state =
            'waiting';

          currentLobby.phase =
            undefined;

          this.server
            .to(code)
            .emit(
              'game:finished',
              {
                scores:
                  currentLobby.players.map(
                    (player) => ({
                      id:
                        player.id,

                      nickname:
                        player.nickname,
                    avatar: player.avatar,

                      score:
                        player.score,
                    }),
                  ),
              },
            );

          return;
        }

        /*
         * Nouvelle manche.
         *
         * startRound() nettoie
         * encore tous les timers
         * par sécurité.
         */
        this.startRound(
          code,
        );
      }, 10_000);

    this.resultsTimers.set(
      code,
      timer,
    );
  }

  // =====================================================
  // TIMER HELPERS
  // =====================================================

  private clearDrawingTimer(
    code: string,
  ) {
    const timer =
      this.drawingTimers.get(
        code,
      );

    if (timer) {
      clearTimeout(timer);

      this.drawingTimers.delete(
        code,
      );
    }
  }

  private clearReviewTimer(
    code: string,
  ) {
    const timer =
      this.reviewTimers.get(
        code,
      );

    if (timer) {
      clearTimeout(timer);

      this.reviewTimers.delete(
        code,
      );
    }
  }

  private clearVotingTimer(
    code: string,
  ) {
    const timer =
      this.votingTimers.get(
        code,
      );

    if (timer) {
      clearTimeout(timer);

      this.votingTimers.delete(
        code,
      );
    }
  }

  private clearResultsTimer(
    code: string,
  ) {
    const timer =
      this.resultsTimers.get(
        code,
      );

    if (timer) {
      clearTimeout(timer);

      this.resultsTimers.delete(
        code,
      );
    }
  }

  private clearAllTimers(
    code: string,
  ) {
    this.clearDrawingTimer(
      code,
    );

    this.clearReviewTimer(
      code,
    );

    this.clearVotingTimer(
      code,
    );

    this.clearResultsTimer(
      code,
    );
  }
}