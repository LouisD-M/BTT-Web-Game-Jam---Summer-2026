# 🎨 Draw Impostor

<p align="center">
  <strong>A multiplayer drawing & deception game made for the BTT Web Game Jam – Summer 2026.</strong>
</p>

<p align="center">
  Draw. Guess. Lie. Find the impostor.
</p>

---

# 🌍 Choose your language

- 🇬🇧 [English](#-english)
- 🇫🇷 [Français](#-français)

---

# 🇬🇧 English

## 📚 Table of Contents

- [About the project](#-about-the-project)
- [Why this project exists](#-why-this-project-exists)
- [How the game works](#-how-the-game-works)
- [Game modifiers](#-game-modifiers)
- [Main features](#-main-features)
- [Tech stack](#-tech-stack)
- [Project architecture](#-project-architecture)
- [Installation](#-installation)
- [Running the project](#-running-the-project)
- [Environment variables](#-environment-variables)
- [Production deployment](#-production-deployment)
- [Scoring system](#-scoring-system)
- [What I learned](#-what-i-learned)
- [Challenges](#-challenges)
- [Game Jam](#-game-jam)
- [Author](#-author)

---

## 🎮 About the project

**Draw Impostor** is a real-time multiplayer browser game mixing:

- drawing
- deduction
- deception
- social interaction

At the beginning of each round, most players receive the **same word**.

One player is secretly selected as the **Impostor** and receives a **different but related word**.

Everyone must then draw their word without revealing it directly.

Once the drawing phase ends, all drawings are shown to the players.

The players must analyze them and vote to identify the impostor.

The impostor's goal is simple:

> Blend in without being discovered.

---

## 💡 Why this project exists

The idea came during an evening with friends.

We were playing an impostor-style game where one player receives slightly different information from everyone else.

The situations were already funny, but we started wondering:

> What if instead of explaining the word, everybody had to draw it?

Drawing immediately creates more chaos.

Some people are good at drawing.

Some are terrible.

Some drawings are obvious.

Others make absolutely no sense.

And when the impostor has a word that is very close to the real one, even a good drawing can become suspicious.

When I discovered the **BTT Web Game Jam – Summer 2026**, I thought it was the perfect opportunity to turn that idea into a real multiplayer web game.

The goal was not to create the most complex game possible.

The goal was to create something:

- simple to understand
- quick to join
- fun with friends
- replayable
- technically interesting to build

And most importantly:

> A game capable of creating memorable and ridiculous situations between players.

---

## 🕹️ How the game works

A game requires at least **3 players**.

### 1. Create a lobby

One player creates a lobby and receives a unique lobby code.

Other players can join using:

- the lobby code
- a nickname

### 2. Configure the game

The host can configure:

- number of rounds
- drawing duration
- available game modifiers

### 3. Start a round

At the beginning of every round:

- one player is randomly selected as the impostor
- normal players receive the same word
- the impostor receives a related but different word
- one game modifier can be selected

Example:

```text
Normal players:
Cat

Impostor:
Tiger
```

### 4. Draw

Players must draw their word before the timer ends.

They can use a custom drawing canvas containing multiple tools.

### 5. Review

Once everybody has finished, all drawings are displayed.

Players can compare the drawings and try to find suspicious differences.

### 6. Vote

Each player votes for the person they believe is the impostor.

You cannot vote for yourself.

### 7. Results

The real impostor is revealed.

The game displays:

- each player's word
- the impostor
- votes
- scores
- drawings

Then the next round starts automatically.

---

## 🌀 Game modifiers

To make each round less predictable, Draw Impostor includes special drawing rules.

The host can select which modifiers are available.

A modifier can then be randomly selected for a round.

### 🟣 Normal

Classic drawing mode.

No additional restriction.

### 🎨 Two Colors

Players can only use two colors.

This forces everybody to simplify their drawing.

### ✏️ One Stroke

Players only get one continuous drawing action.

Once the stroke is finished, they cannot start another one.

### 🔄 Reverse Mouse

Mouse movements are inverted.

Moving right makes the cursor draw left.

Moving up makes it draw down.

### ⚡ Speed Draw

Drawing time is reduced to:

```text
10 seconds
```

No time to think.

Just draw.

### 🙈 Blind Draw

Players can draw, but they cannot see what they are drawing until the phase ends.

### 👥 Shared Canvas

A multiplayer-oriented modifier designed around shared drawing interactions.

---

## ✨ Main features

### Real-time multiplayer

The game uses Socket.IO to synchronize players in real time.

Players can:

- create lobbies
- join lobbies
- leave lobbies
- receive synchronized lobby updates
- play synchronized rounds
- submit drawings
- vote
- receive results and scores

### Custom avatars

Each player can draw their own avatar directly inside the game.

The avatar is synchronized with the lobby and displayed during the game.

### Custom drawing engine

The drawing canvas was built specifically for Draw Impostor.

Available tools include:

- Pen
- Eraser
- Line
- Rectangle
- Circle
- Arrow
- Spray
- Highlighter
- Fill bucket
- Eyedropper
- Text
- Undo
- Redo
- Clear canvas
- Brush size
- Opacity
- Color palette

The final drawing is exported as an image and sent to the server.

### Server-authoritative game flow

The server controls:

- game state
- round number
- impostor selection
- words
- timers
- game phases
- voting
- scores
- modifiers

This keeps all players synchronized and avoids each browser controlling its own version of the game.

### Automatic game phases

The game automatically progresses through:

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

After the final round:

```text
FINAL RANKING
```

---

## 🛠️ Tech stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Socket.IO Client

### Backend

- NestJS
- TypeScript
- Socket.IO
- WebSocket Gateway

### Hosting

Frontend: `Vercel`

Backend: `Railway`

### Data storage

Draw Impostor currently uses an **in-memory lobby system**.

No database is required.

This keeps the Game Jam version lightweight and easy to deploy.

---

## 📁 Project architecture

The project uses a simple monorepo architecture.

```text
draw-impostor/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── avatar/
│       │   ├── game/
│       │   ├── home/
│       │   ├── lobby/
│       │   └── player/
│       ├── pages/
│       ├── socket/
│       └── types/
│
├── server/
│   └── src/
│       ├── game/
│       │   └── word-pairs.ts
│       └── lobby/
│           ├── lobby.gateway.ts
│           ├── lobby.service.ts
│           └── lobby.types.ts
│
└── README.md
```

---

## 📦 Installation

### Requirements

Make sure you have installed:

- Node.js
- npm
- Git

Recommended:

```text
Node.js 20+
```

### 1. Clone the repository

```bash
git clone https://github.com/LouisD-M/BTT-Web-Game-Jam---Summer-2026.git
```

Enter the project:

```bash
cd BTT-Web-Game-Jam---Summer-2026
```

### 2. Install the frontend

```bash
cd client
npm install
```

### 3. Install the backend

Open another terminal:

```bash
cd server
npm install
```

---

## 🚀 Running the project

You need two terminals.

### Backend

From `server/`:

```bash
npm run start:dev
```

The backend runs locally on:

```text
http://localhost:9025
```

### Frontend

From `client/`:

```bash
npm run dev
```

The frontend runs by default on:

```text
http://localhost:5173
```

Open this URL in your browser.

---

## 🔐 Environment variables

### Frontend

Create:

```text
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:9025
```

In production:

```env
VITE_API_URL=https://your-backend.up.railway.app
```

### Backend

For production:

```env
FRONTEND_URL=https://your-project.vercel.app
```

Railway automatically provides the production port.

Locally, the server falls back to `9025`.

---

## 🌐 Production deployment

### Frontend — Vercel

Configure:

```text
Root Directory:
client
```

Environment variable:

```env
VITE_API_URL=https://your-railway-backend.up.railway.app
```

### Backend — Railway

Configure:

```text
Root Directory:
server
```

Add:

```env
FRONTEND_URL=https://your-vercel-project.vercel.app
```

Railway manages the public port automatically.

---

## 🏆 Scoring system

### Normal players

A normal player receives **+1 point** if they correctly vote for the impostor.

### Impostor

The impostor receives **+1 point** if nobody votes for them.

This encourages the impostor to create a drawing close enough to the real word to remain unnoticed.

---

## 🧠 What I learned

This project was a great opportunity to work on much more than a traditional frontend application.

### Real-time multiplayer

I worked with Socket.IO to synchronize:

- players
- lobby state
- drawings
- votes
- timers
- game phases

### Game state management

One of the most interesting parts was building a predictable multiplayer game loop.

The server acts as the source of truth and controls every phase.

### Canvas API

Building the drawing system required working with:

- pointer events
- canvas rendering
- drawing history
- shapes
- colors
- opacity
- image export
- flood fill
- custom drawing tools

### Deployment

The project also required deploying two separate applications:

- the React frontend on Vercel
- the NestJS WebSocket backend on Railway

This required handling:

- production environment variables
- WebSocket URLs
- CORS
- dynamic ports

---

## 🧩 Challenges

### Synchronizing players

A multiplayer game must keep every connected browser synchronized.

A player joining, leaving, finishing a drawing, voting, or starting a new round must immediately update the correct players.

### Timers

Timers are controlled by the backend.

The challenge was making sure an old timer could not accidentally trigger after the game had already moved to another phase.

Each lobby therefore has dedicated timers for:

- drawing
- review
- voting
- results

### Building the drawing canvas

Instead of using an external drawing application, the drawing system was created directly inside the project.

Adding different tools while keeping undo, redo, modifiers, avatars and game drawing compatible required careful separation of the canvas logic.

### Game modifiers

Each modifier changes a different part of the system:

- **Reverse Mouse** modifies pointer coordinates.
- **One Stroke** restricts drawing actions.
- **Blind Draw** hides the canvas without disabling interaction.
- **Speed Draw** modifies the server timer.

---

## 🏁 Game Jam

Draw Impostor was created for the **BTT Web Game Jam – Summer 2026**.

The project was developed as a solo project during the Game Jam period.

The main goals were:

- creativity
- fun
- multiplayer interaction
- technical execution
- browser accessibility

The Game Jam gave me the perfect excuse to stop thinking:

> "This could be a fun idea."

and actually build it.

---

## 👨‍💻 Author

Created by **Louis Debray-Marchand**

GitHub: `LouisD-M`

---

# 🇫🇷 Français

## 📚 Sommaire

- [À propos du projet](#-à-propos-du-projet)
- [Pourquoi ce projet est né](#-pourquoi-ce-projet-est-né)
- [Comment fonctionne le jeu](#-comment-fonctionne-le-jeu)
- [Modificateurs](#-modificateurs)
- [Fonctionnalités principales](#-fonctionnalités-principales)
- [Technologies](#-technologies)
- [Architecture](#-architecture)
- [Installation](#-installation-1)
- [Lancer le projet](#-lancer-le-projet)
- [Variables d'environnement](#-variables-denvironnement)
- [Déploiement](#-déploiement)
- [Système de score](#-système-de-score)
- [Ce que j'ai appris](#-ce-que-jai-appris)
- [Les difficultés rencontrées](#-les-difficultés-rencontrées)
- [Game Jam](#-game-jam-1)
- [Auteur](#-auteur)

---

## 🎮 À propos du projet

**Draw Impostor** est un jeu multijoueur web en temps réel qui mélange :

- dessin
- déduction
- bluff
- interaction sociale

Au début de chaque manche, la majorité des joueurs reçoit **le même mot**.

Un joueur est secrètement désigné comme **Imposteur** et reçoit un **mot différent mais proche**.

Tous les joueurs doivent ensuite dessiner leur mot sans le révéler directement.

Une fois la phase de dessin terminée, les créations de tous les joueurs sont affichées.

Les joueurs doivent alors analyser les dessins et voter pour identifier l'imposteur.

L'objectif de l'imposteur est simple :

> Se fondre dans le groupe sans se faire repérer.

---

## 💡 Pourquoi ce projet est né

L'idée est née pendant une soirée entre amis.

Nous jouions à un jeu de type imposteur dans lequel une personne possède une information légèrement différente des autres.

Les situations étaient déjà très drôles.

Puis nous nous sommes demandé :

> Et si au lieu de parler, tout le monde devait dessiner ?

Le dessin rend immédiatement les situations beaucoup plus chaotiques.

Certains savent dessiner.

D'autres beaucoup moins.

Certains dessins sont évidents.

D'autres ressemblent absolument à autre chose.

Et lorsque l'imposteur possède un mot très proche du vrai mot, même un bon dessin peut devenir extrêmement suspect.

En découvrant le **BTT Web Game Jam – Summer 2026**, je me suis dit que c'était exactement le bon moment pour essayer de transformer cette idée en véritable jeu multijoueur web.

Le but n'était pas de créer le jeu le plus complexe possible.

Je voulais surtout créer quelque chose :

- simple à comprendre
- rapide à rejoindre
- drôle entre amis
- rejouable
- intéressant techniquement à développer

Et surtout :

> Un jeu capable de créer des situations complètement absurdes et mémorables entre amis.

---

## 🕹️ Comment fonctionne le jeu

Une partie nécessite au minimum **3 joueurs**.

### 1. Création du lobby

Un joueur crée une partie.

Un code unique est généré.

Les autres joueurs peuvent rejoindre avec :

- le code du lobby
- leur pseudo

### 2. Configuration

L'hôte peut configurer :

- le nombre de manches
- le temps de dessin
- les modificateurs disponibles

### 3. Début de manche

À chaque manche :

- un imposteur est choisi aléatoirement
- les joueurs normaux reçoivent le même mot
- l'imposteur reçoit un mot différent mais proche
- un modificateur peut être sélectionné

Exemple :

```text
Joueurs normaux :
Chat

Imposteur :
Tigre
```

### 4. Dessin

Chaque joueur doit dessiner son mot avant la fin du temps.

Un canvas personnalisé permet d'utiliser plusieurs outils de dessin.

### 5. Observation

Lorsque tout le monde a terminé, tous les dessins sont affichés.

Les joueurs peuvent alors comparer les créations et chercher les éléments suspects.

### 6. Vote

Chaque joueur vote pour la personne qu'il pense être l'imposteur.

Il est impossible de voter contre soi-même.

### 7. Résultats

L'imposteur est révélé.

Le jeu affiche :

- les mots
- l'imposteur
- les votes
- les scores
- les dessins

La manche suivante commence ensuite automatiquement.

---

## 🌀 Modificateurs

Pour rendre les manches moins prévisibles, Draw Impostor propose plusieurs règles spéciales.

L'hôte peut sélectionner les modificateurs disponibles dans la partie.

Un modificateur peut ensuite être sélectionné aléatoirement au début d'une manche.

### 🟣 Normal

Mode classique. Aucune restriction particulière.

### 🎨 Deux couleurs

Les joueurs ne disposent que de deux couleurs pour dessiner.

### ✏️ Un seul trait

Le joueur n'a droit qu'à une seule action de dessin continue.

Une fois son trait terminé, il ne peut plus en commencer un autre.

### 🔄 Souris inversée

Les mouvements de la souris sont inversés.

Déplacer la souris vers la droite dessine vers la gauche.

Déplacer la souris vers le haut dessine vers le bas.

### ⚡ Speed Draw

Le temps de dessin est réduit à **10 secondes**.

Il faut dessiner très vite.

### 🙈 Blind Draw

Le joueur dessine normalement mais ne peut pas voir ce qu'il est en train de dessiner.

### 👥 Shared Canvas

Un mode orienté vers des interactions de dessin partagées entre plusieurs joueurs.

---

## ✨ Fonctionnalités principales

### Multijoueur temps réel

Le jeu utilise Socket.IO pour synchroniser les joueurs.

Il permet notamment de :

- créer un lobby
- rejoindre un lobby
- synchroniser les joueurs
- lancer une partie
- synchroniser les manches
- envoyer les dessins
- voter
- synchroniser les scores

### Avatars personnalisés

Chaque joueur peut dessiner directement son propre avatar.

L'avatar est ensuite synchronisé avec les autres joueurs du lobby.

### Canvas de dessin personnalisé

Le moteur de dessin a été développé spécifiquement pour Draw Impostor.

Il propose notamment :

- Crayon
- Gomme
- Ligne
- Rectangle
- Cercle
- Flèche
- Spray
- Surligneur
- Pot de peinture
- Pipette
- Texte
- Undo
- Redo
- Effacement du canvas
- Taille du pinceau
- Opacité
- Palette de couleurs

Le dessin final est exporté sous forme d'image avant d'être envoyé au serveur.

### Serveur autoritaire

Le serveur est responsable de l'état réel de la partie.

Il contrôle :

- les joueurs
- les manches
- l'imposteur
- les mots
- les modificateurs
- les phases
- les timers
- les votes
- les scores

### Phases automatiques

Chaque partie suit automatiquement le cycle :

```text
LOBBY
   ↓
DESSIN
   ↓
OBSERVATION
   ↓
VOTE
   ↓
RÉSULTATS
   ↓
MANCHE SUIVANTE
```

Après la dernière manche :

```text
CLASSEMENT FINAL
```

---

## 🛠️ Technologies

### Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Socket.IO Client

### Backend

- NestJS
- TypeScript
- Socket.IO
- WebSocket Gateway

### Hébergement

Frontend : `Vercel`

Backend : `Railway`

### Stockage

La version Game Jam utilise actuellement un stockage des lobbies **en mémoire**.

Aucune base de données n'est nécessaire.

Cela permet de garder une architecture légère et adaptée au projet.

---

## 📁 Architecture

Le projet utilise une structure monorepo :

```text
draw-impostor/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── avatar/
│       │   ├── game/
│       │   ├── home/
│       │   ├── lobby/
│       │   └── player/
│       ├── pages/
│       ├── socket/
│       └── types/
│
├── server/
│   └── src/
│       ├── game/
│       │   └── word-pairs.ts
│       └── lobby/
│           ├── lobby.gateway.ts
│           ├── lobby.service.ts
│           └── lobby.types.ts
│
└── README.md
```

---

## 📦 Installation

### Prérequis

Il faut avoir :

- Node.js
- npm
- Git

Version conseillée :

```text
Node.js 20+
```

### 1. Cloner le dépôt

```bash
git clone https://github.com/LouisD-M/BTT-Web-Game-Jam---Summer-2026.git
```

Puis :

```bash
cd BTT-Web-Game-Jam---Summer-2026
```

### 2. Installer le frontend

```bash
cd client
npm install
```

### 3. Installer le backend

Dans un autre terminal :

```bash
cd server
npm install
```

---

## 🚀 Lancer le projet

Deux terminaux sont nécessaires.

### Backend

Depuis `server/` :

```bash
npm run start:dev
```

Le serveur fonctionne en local sur :

```text
http://localhost:9025
```

### Frontend

Depuis `client/` :

```bash
npm run dev
```

Le frontend sera généralement disponible sur :

```text
http://localhost:5173
```

Il suffit ensuite d'ouvrir cette adresse dans le navigateur.

---

## 🔐 Variables d'environnement

### Frontend

Créer :

```text
client/.env
```

Ajouter :

```env
VITE_API_URL=http://localhost:9025
```

En production :

```env
VITE_API_URL=https://your-backend.up.railway.app
```

### Backend

En production :

```env
FRONTEND_URL=https://your-project.vercel.app
```

Railway fournit automatiquement `PORT`.

En local, le backend utilise `9025`.

---

## 🌐 Déploiement

### Frontend — Vercel

Configurer :

```text
Root Directory:
client
```

Puis ajouter :

```env
VITE_API_URL=https://your-railway-backend.up.railway.app
```

### Backend — Railway

Configurer :

```text
Root Directory:
server
```

Ajouter :

```env
FRONTEND_URL=https://your-vercel-project.vercel.app
```

Railway fournit automatiquement le port utilisé par le serveur.

---

## 🏆 Système de score

### Joueurs normaux

Un joueur normal gagne **+1 point** s'il vote correctement pour l'imposteur.

### Imposteur

L'imposteur gagne **+1 point** si aucun joueur ne vote contre lui.

Son objectif n'est donc pas simplement de dessiner son mot.

Il doit surtout produire quelque chose suffisamment crédible pour ne pas attirer les soupçons.

---

## 🧠 Ce que j'ai appris

Draw Impostor m'a permis de travailler sur plusieurs problématiques différentes.

### Multijoueur temps réel

Socket.IO m'a permis de gérer :

- les connexions
- les lobbies
- les joueurs
- les dessins
- les votes
- les phases
- les timers

### Gestion d'un game state

Le jeu possède plusieurs états qui doivent rester parfaitement synchronisés entre les joueurs.

Le backend est donc utilisé comme source de vérité.

### Canvas

Le développement du canvas m'a permis de travailler sur :

- Pointer Events
- rendu Canvas
- historique des actions
- formes géométriques
- couleurs
- opacité
- export d'image
- flood fill
- outils personnalisés

### Déploiement

Le projet m'a également permis de travailler sur une architecture déployée en deux parties :

```text
React / Vite
        ↓
      Vercel

NestJS / Socket.IO
        ↓
      Railway
```

Cela implique notamment de gérer :

- les variables d'environnement
- CORS
- les WebSockets
- les ports dynamiques
- les builds de production

---

## 🧩 Les difficultés rencontrées

### Synchronisation

La principale difficulté d'un jeu multijoueur est de garantir que tous les joueurs possèdent le même état de partie.

### Timers

Chaque phase utilise un timer côté serveur.

Il fallait éviter qu'un ancien timer puisse déclencher une action alors que la partie était déjà passée à la phase suivante.

Des timers séparés sont donc utilisés pour :

- dessin
- observation
- vote
- résultats

### Canvas

Créer le moteur de dessin directement dans le projet était également un défi important.

Il fallait faire fonctionner ensemble :

- les outils
- l'historique
- les avatars
- les modificateurs
- le dessin principal

### Modificateurs

Chaque modificateur impacte une partie différente du système :

- **Reverse Mouse** modifie les coordonnées du pointeur.
- **One Stroke** limite les actions disponibles.
- **Blind Draw** cache visuellement le canvas tout en conservant les interactions.
- **Speed Draw** modifie directement le timer côté serveur.

---

## 🏁 Game Jam

Draw Impostor a été créé pour le **BTT Web Game Jam – Summer 2026**.

Le projet a été développé en solo pendant la période de la Game Jam.

L'objectif était de proposer un jeu :

- créatif
- amusant
- accessible directement depuis un navigateur
- réellement multijoueur
- techniquement intéressant

Cette Game Jam a surtout été l'occasion de transformer une idée née entre amis en un véritable projet jouable.

---

## 👨‍💻 Auteur

Créé par **Louis Debray-Marchand**

GitHub : `LouisD-M`

---

## ❤️ Final note

Draw Impostor started with a very simple question:

> What happens if you mix an impostor game with terrible drawings?

The answer is:

**a lot of chaos.**

And that's exactly the point.
