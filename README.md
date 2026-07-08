# GreenSales

GreenSales est une application web de gestion commerciale permettant à un commercial de suivre ses prospects, ses rendez-vous et ses ventes.

Le projet a été réalisé dans le cadre du titre professionnel **Concepteur Développeur d'Applications (CDA)**.

---

# Technologies utilisées

## Frontend

- React
- Vite
- React Router
- Axios

## Backend

- Node.js
- Express
- Prisma ORM
- JWT
- Bcrypt

## Base de données

- PostgreSQL
- Docker

---

# Installation

## 1. Cloner le projet

```bash
git clone <url-du-projet>

cd GreenSales
```

---

## 2. Installer les dépendances

### Racine

```bash
npm install
```

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd ../frontend
npm install
```

---

# Configuration

Créer un fichier :

```
backend/.env
```

avec le contenu suivant :

```env
DATABASE_URL="postgresql://admin:admin@localhost:5432/greensales"
JWT_SECRET=monsecret
```

Créer également :

```
frontend/.env
```

```env
VITE_API_URL=http://localhost:8080
```

---

# Lancer le projet

Depuis la racine :

```bash
npm run dev:all
```

Cette commande :

- démarre PostgreSQL avec Docker
- lance le backend
- lance le frontend

---

# URLs

Frontend :

```
http://localhost:5173
```

Backend :

```
http://localhost:8080
```

---

# Docker

La base PostgreSQL est créée automatiquement via Docker Compose.

Pour arrêter la base :

```bash
npm run db:stop
```

Pour la relancer :

```bash
npm run db:start
```

---

# Prisma

En cas de modification du schéma :

Générer le client Prisma :

```bash
cd backend

npx prisma generate
```

Mettre à jour la base :

```bash
npx prisma db push
```

---

# Structure du projet

```
GreenSales
│
├── backend
│   ├── prisma
│   ├── src
│   ├── package.json
│   └── .env
│
├── frontend
│   ├── src
│   ├── package.json
│   └── .env
│
├── docker-compose.yml
├── package.json
└── README.md
```

---

# Scripts disponibles

Depuis la racine :

```bash
npm run dev:all
```

Lance :

- PostgreSQL
- Backend
- Frontend

---

```bash
npm run db:start
```

Lance PostgreSQL.

---

```bash
npm run db:stop
```

Arrête PostgreSQL.

---

# Authentification

L'application utilise :

- JWT
- bcrypt pour le hachage des mots de passe.

---

# Base de données

La base est gérée avec :

- PostgreSQL
- Prisma ORM

Les tables sont créées automatiquement grâce au schéma Prisma.

---

# Déploiement

La version locale fonctionne entièrement avec Docker.

Pour une démonstration en ligne, il est possible de redéployer l'application sur :

- Railway
- Render
- Neon
- Vercel

sans modifier le code métier.

---

# Auteur

Projet réalisé par Julie Charles dans le cadre du titre professionnel CDA.