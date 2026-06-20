# Projet 2 - Clinical Study Manager

Application web de gestion d'études cliniques.

Stack utilisée :
- NestJS pour l'API
- Angular pour le frontend
- PostgreSQL pour la base de données

## Lancer le projet après un pull Git

### 1. Prérequis

Installer :
- Node.js et npm
- PostgreSQL

Vérifier que PostgreSQL est lancé en local avec les informations suivantes :

```txt
Host=localhost
Port=5432
Username=TON_USERNAME
Password=TON_PASSWORD
```

### 2. Lancer l'API NestJS

Ouvrir un premier terminal :

```powershell
cd Projet2\nest-js-api
npm install
Copy-Item .env.example .env
notepad .env
```

Dans le fichier `.env`, verifier au minimum ces valeurs :

```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=nicolas
DB_PASSWORD=P@ssword
DB_DATABASE=postgres
DB_SYNC=true
APP_PORT=3000
APP_MODE=DEV
APP_BASE_URL=api
```

Démarrer ensuite l'API :

```powershell
npm run start:dev
```

URLs :
- API : http://localhost:3000/api
- Swagger : http://localhost:3000/docs

### 3. Lancer le frontend Angular

Ouvrir un deuxième terminal :

```powershell
cd Projet2\angular-frontend
npm install
npm start
```

URL application : http://localhost:4200


## Fonctionnalités principales

- Inscription
- Connexion
- Refresh token
- Récupération de l'utilisateur connecté
- Modification du mot de passe
- Module métier Études cliniques

Le module métier Études cliniques contient 5 opérations :
- Liste des études
- Détail d'une étude
- Création d'une étude
- Édition d'une étude
- Suppression d'une étude
