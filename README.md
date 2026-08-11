# Draw Impostor

Draw Impostor est un jeu multijoueur web de dessin et de déduction.

À chaque manche, la majorité des joueurs reçoit le même mot tandis qu'un joueur, l'imposteur, reçoit un mot proche mais différent.

Chaque joueur doit dessiner son mot sans le révéler. Une fois la phase de dessin terminée, les dessins sont affichés aux joueurs, qui doivent ensuite voter pour identifier l'imposteur.

## Fonctionnalités

* Création de lobby privé
* Rejoindre une partie avec un code
* Gestion du host
* Synchronisation multijoueur avec Socket.IO
* Minimum 3 joueurs
* Attribution aléatoire d'un imposteur
* Attribution de mots différents entre joueurs et imposteur
* Environ 100 paires de mots prévues
* Canvas de dessin
* Sauvegarde temporaire des dessins
* Phase de présentation des dessins
* Phase de vote
* 60 secondes pour voter
* Résultats de chaque manche
* Système de score
* Classement final
* Plusieurs manches
* Nettoyage des timers entre les manches

## Règles

Pour chaque manche :

1. Un joueur est sélectionné aléatoirement comme imposteur.
2. Les joueurs normaux reçoivent un mot.
3. L'imposteur reçoit un mot similaire mais différent.
4. Chaque joueur dessine son mot.
5. Les dessins sont ensuite affichés.
6. Les joueurs votent pour la personne qu'ils pensent être l'imposteur.
7. L'identité de l'imposteur et les mots sont révélés.
8. Les scores sont mis à jour.
9. Une nouvelle manche commence.

### Score

* Un joueur normal gagne **+1 point** s'il vote pour l'imposteur.
* L'imposteur gagne **+1 point** si aucun joueur ne vote contre lui.
* À la fin de la partie, les joueurs sont classés selon leur score total.

---

# Stack technique

## Frontend

* React
* TypeScript
* Vite
* React Router
* Socket.IO Client

## Backend

* Node.js
* NestJS
* TypeScript
* Socket.IO
* Stockage des lobbies en mémoire

Aucune base de données n'est nécessaire pour le moment.

---

# Prérequis

Installer :

* Node.js
* npm
* Git

Une version récente de Node.js est recommandée.

Vérifier l'installation :

```bash
node --version
npm --version
git --version
```

---

# Installation depuis Git

Cloner le repository :

```bash
git clone URL_DU_REPOSITORY
```

Entrer dans le projet :

```bash
cd draw-impostor
```

Installer les dépendances du projet racine :

```bash
npm install
```

Installer les dépendances du frontend :

```bash
cd client
npm install
```

Puis revenir à la racine :

```bash
cd ..
```

Installer les dépendances du backend :

```bash
cd server
npm install
```

Puis revenir à la racine :

```bash
cd ..
```

---

# Lancer le projet

Depuis la racine :

```bash
npm run dev
```

Cette commande démarre le frontend et le backend en parallèle.

## Adresses locales

Frontend :

```text
http://localhost:5173
```

Backend NestJS :

```text
http://localhost:9025
```

Socket.IO utilise également le backend sur le port :

```text
9025
```

---

# Scripts

Depuis la racine :

```bash
npm run dev
```

Lance le client et le serveur.

Pour lancer uniquement le frontend :

```bash
npm run dev:client
```

Pour lancer uniquement le backend :

```bash
npm run dev:server
```

---

# Structure du projet

```text
draw-impostor/
│
├── client/
│   └── src/
│       ├── components/
│       │   ├── game/
│       │   │   ├── DrawingCanvas.tsx
│       │   │   ├── DrawingPhase.tsx
│       │   │   ├── ReviewPhase.tsx
│       │   │   ├── VotingPhase.tsx
│       │   │   ├── ResultsPhase.tsx
│       │   │   ├── FinalRanking.tsx
│       │   │   ├── GameTimer.tsx
│       │   │   ├── WordDisplay.tsx
│       │   │   └── GameRuleBadge.tsx
│       │   │
│       │   └── lobby/
│       │
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── LobbyPage.tsx
│       │   └── GamePage.tsx
│       │
│       ├── socket/
│       │   └── socket.ts
│       │
│       └── types/
│
├── server/
│   └── src/
│       ├── lobby/
│       │   ├── lobby.gateway.ts
│       │   ├── lobby.service.ts
│       │   ├── lobby.module.ts
│       │   └── lobby.types.ts
│       │
│       ├── game/
│       │   └── word-pairs.ts
│       │
│       ├── app.module.ts
│       └── main.ts
│
├── package.json
└── README.md
```

---

# Fonctionnement multijoueur

Le serveur NestJS est responsable de l'état de la partie.

Il contrôle notamment :

* les lobbies ;
* les joueurs ;
* l'imposteur ;
* les mots ;
* le numéro de manche ;
* les phases de jeu ;
* les votes ;
* les scores ;
* les timers.

Les clients React ne décident pas eux-mêmes quand une manche change.

Le serveur synchronise tous les joueurs avec Socket.IO.

---

# Phases d'une manche

```text
LOBBY
  ↓
DRAWING
  ↓
REVIEW
  ↓
VOTING
  ↓
RESULTS
  ↓
NEXT ROUND
```

À la dernière manche :

```text
RESULTS
  ↓
FINAL RANKING
```

---

# Test multijoueur local

Lancer :

```bash
npm run dev
```

Ouvrir ensuite plusieurs navigateurs ou fenêtres privées sur :

```text
http://localhost:5173
```

Exemple :

* Chrome
* Chrome navigation privée
* Firefox

Créer un lobby avec le premier joueur.

Copier le code du lobby.

Faire rejoindre les autres joueurs avec ce code.

Il faut au minimum **3 joueurs** pour commencer une partie.

---

# Développement futur

Fonctionnalités prévues ou envisagées :

* davantage de paires de mots ;
* packs de mots personnalisés ;
* import CSV / JSON ;
* paramètres de partie ;
* choix du nombre de manches ;
* choix du temps de dessin ;
* modificateurs de dessin ;
* deux couleurs uniquement ;
* dessin en un seul trait ;
* souris inversée ;
* dessin à l'aveugle ;
* canvas partagé ;
* amélioration de l'interface ;
* animations ;
* effets sonores ;
* meilleure gestion des reconnexions ;
* système de rematch.

---

# Projet

Projet développé pour expérimenter un party game multijoueur directement dans le navigateur avec React, NestJS et Socket.IO.
