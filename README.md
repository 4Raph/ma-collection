# Ma Collection — CyberCollection

**CyberCollection** est une application web permettant de découvrir un catalogue d'attaques informatiques et de gérer sa collection personnelle.

L'application repose sur une API REST développée avec FastAPI et une interface utilisateur développée avec React et TypeScript.

## Fonctionnalités

### Catalogue d'attaques informatiques
- Consulter un catalogue d'attaques informatiques.
- Afficher les informations détaillées d'une attaque.
- Rechercher et parcourir les attaques disponibles.
- Consulter les informations associées à chaque attaque : titre, catégorie, description, année, type et niveau.

### Authentification
- Créer un compte utilisateur.
- Se connecter avec son adresse e-mail et son mot de passe.
- Accéder à sa collection personnelle après authentification.
- Protéger les routes nécessitant une authentification grâce aux jetons JWT.

### Collection personnelle
- Ajouter une attaque à sa collection.
- Consulter les attaques de sa collection.
- Modifier les informations de suivi d'une entrée.
- Supprimer une attaque de sa collection.
- Consulter des statistiques sur sa collection.

### API REST
- Gestion des utilisateurs et de l'authentification.
- Gestion du catalogue d'attaques.
- Gestion des collections personnelles.
- Documentation interactive avec Swagger UI.

## Technologies utilisées

| Partie | Technologies |
|---|---|
| Backend | Python, FastAPI |
| ORM et modèles | SQLModel, SQLAlchemy |
| Base de données | PostgreSQL |
| Frontend | React, TypeScript |
| Outils frontend | Vite, npm |
| Authentification | JWT |
| Conteneurisation | Docker, Docker Compose |


## Prérequis

Avant de lancer le projet, il faut disposer des outils suivants :

- Python 3.12 ou une version compatible avec les dépendances du projet.
- Node.js et npm.
- Docker et Docker Compose.
- Git, si le projet est récupéré depuis un dépôt.

## Installation et lancement

### 1. Récupérer le projet

Si le projet est hébergé sur un dépôt Git :

```bash
git clone <URL_DU_DEPOT>
cd ma-collection
```

Si le projet est déjà présent sur la machine, se placer directement dans son dossier.

### 2. Configurer les variables d'environnement

Créer ou compléter le fichier `.env` avec les variables nécessaires au backend.

Exemple de configuration à adapter à `docker-compose.yml` :

```env
POSTGRES_PASSWORD=remplacer_par_un_mot_de_passe
JWT_SECRET=remplacer_par_une_cle_secrete_aleatoire
JWT_EXPIRE_MINUTES=30
```

Les valeurs doivent correspondre à la configuration de PostgreSQL et de Docker Compose. Le nom d'hôte de la base de données dépend du réseau utilisé : dans Docker Compose, il correspond généralement au nom du service PostgreSQL.


### 3. Démarrer le backend et la base de données

Depuis la racine du projet :

```bash
sudo docker compose up --build -d
```

Vérifier l'état des conteneurs :

```bash
sudo docker compose ps
```

Consulter les journaux en cas de problème :

```bash
sudo docker compose logs -f
```

Pour arrêter les services :

```bash
sudo docker compose down
```

Cette commande conserve normalement les données stockées dans un volume Docker. Pour supprimer également les volumes, il faut utiliser une commande distincte et vérifier ses conséquences avant de l'exécuter.

### 4. Démarrer le frontend

Dans un autre terminal :

```bash
cd web
npm install
npm run dev
```

Le serveur de développement Vite affiche l'adresse locale à ouvrir dans le navigateur, généralement :

http://localhost:5173

Le frontend doit pouvoir joindre l'API à l'adresse configurée dans `web/src/services/api.ts`, actuellement :

```text
http://127.0.0.1:8000
```

Si le frontend ou l'API est exécuté dans un autre environnement, cette adresse doit être adaptée.

## Accès à l'application

Une fois les services démarrés :

| Service | Adresse |
|---|---|
| Interface web | http://localhost:5173 |
| API FastAPI | http://localhost:8000 |
| Documentation Swagger | http://localhost:8000/docs |
| Documentation ReDoc | http://localhost:8000/redoc |

Swagger UI permet de tester les routes de l'API directement depuis le navigateur.

## Principales routes de l'API

Les routes suivantes correspondent à l'organisation actuelle du backend.

### Authentification

| Méthode | Route | Description |
|---|---|---|
| POST | `/auth/register` | Créer un compte |
| POST | `/auth/login` | Se connecter |
| GET | `/auth/me` | Obtenir les informations de l'utilisateur connecté |

### Catalogue

| Méthode | Route | Description |
|---|---|---|
| GET | `/items` | Consulter le catalogue |
| GET | `/items/{item_id}` | Consulter une attaque précise |

Le catalogue utilise une pagination. La limite maximale actuellement acceptée est de 50 éléments par requête.

### Collection personnelle

Ces routes nécessitent une authentification.

| Méthode | Route | Description |
|---|---|---|
| GET | `/me/collection` | Consulter sa collection |
| POST | `/me/collection` | Ajouter une attaque à sa collection |
| PATCH | `/me/collection/{entry_id}` | Modifier une entrée |
| DELETE | `/me/collection/{entry_id}` | Supprimer une entrée |
| GET | `/me/stats` | Consulter les statistiques de sa collection |

Les données personnelles sont associées à l'utilisateur authentifié afin que chacun puisse gérer sa propre collection.

## Sécurité

Le projet utilise plusieurs mécanismes de sécurité :

- Hachage des mots de passe avant leur stockage.
- Authentification par jeton JWT.
- Vérification du jeton sur les routes protégées.
- Validation des données entrantes avec les schémas Pydantic.
- Gestion des erreurs HTTP et des accès non autorisés.
- Configuration des secrets par variables d'environnement.

Les paramètres de sécurité, notamment la durée de validité des jetons et la gestion du renouvellement de session, doivent être configurés selon la version effectivement déployée.

## Tests et vérifications

Pour vérifier le frontend :

```bash
cd web
npm run build
```

Cette commande compile l'application et permet de détecter notamment les erreurs TypeScript et de compilation.

Pour vérifier le backend, démarrer l'API puis ouvrir :

http://localhost:8000/docs

Les routes peuvent ensuite être testées depuis Swagger UI, notamment la création d'un compte, la connexion, la consultation du catalogue et la gestion de la collection.

## Auteur

Créer par Osmont Raphaël et Bobin Junca Nils

Projet scolaire B2 — **Ma Collection / CyberCollection**.

Thématique : cybersécurité et catalogue d'attaques informatiques.
