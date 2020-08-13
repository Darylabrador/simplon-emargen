### Installation des modules
> npm install

### Configurer la connexion à la base de donnée en ligne:
1. Copier le fichier **.env.example** et renommer le fichier copié en **.env**
2. Remplacer le contenu de la variable d'environnement **DB_URL** avec celui fournis de la base de donnée
3. Ne pas push l'adresse de la base de donnée dans le fichier **.env.example**
4. Les informations de la base de donnée sont dans le fichier config/database.js.
5. Si vous faites des test unitaires utiliser une base externe de test et non celui de l'application, vous devez donc ajouter le contenu dans **DB_URL_TEST**

### Migration
1. Installation de migrate-mongo : npm install -g migrate-mongo
2. Copier le fichier **./migrations/migrate-mongo-config-example.js** et renommer le fichier copié en **./migrations/migrate-mongo-config.js**
3. Remplacer le contenu des paramètres **url** et **databaseName** avec celui fournis de la base de donnée
4. Ne pas push l'adresse de la base de donnée dans le fichier **back/migrations/migrate-mongo-config-example.js**

### Configuration des fichiers de migration
1. Déplacer vous dans le dossier migrations : cd ./migrations

> Pour le script de migration : users
2. Créer le fichier de migration pour la collection users en utilisant la commande : migrate-mongo create users
3. Copier le contenu du fichier d'example pour le script précemment créer : ./ressources/users-script-migration-example.js

> Pour le script de migration : signoffsheets
4. Créer le fichier de migration pour la collection signoffsheet en utilisant la commande : migrate-mongo create signoffsheets
5. Copier le contenu du fichier d'example pour le script précemment créer : ./ressources/signoffsheet-script-migration-example.js

> Pour le script de migration : templates
6. Créer le fichier de migration pour la collection template en utilisant la commande : migrate-mongo create templates
7. Copier le contenu du fichier d'example pour le script précemment créer : ./ressources/template-script-migration-example.js

Exécuter toutes les migrations de base de données non appliquées
> migrate-mongo up

Annuler la dernière migration de base de données appliquées
> migrate-mongo down

Aficher le journal des modifications de la base de données
> migrate-mongo status

### Lancer le serveur
**Environnement de developpement**
> npm run devstart

**Environnement de production**
> npm start

### Documentation
Pour générer la documentation
> npm run doc

Pour consulter la documentation : **/docs/index.html**