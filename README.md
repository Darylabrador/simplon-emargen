# Emargen

La structure du google sheet doit être de la manière suivante :

<p align="center">
  <img src="https://github.com/Darylabrador/simplon-emargen/blob/Application-v2/ressources/Structure-googlesheet.PNG" width="650" title="hover text">
</p>

## Information pour le client :

Vous pouvez retrouver le client permettant d'effectuer la signature (via le scan d'un qr code) sur la branch : <a href="https://github.com/Darylabrador/simplon-emargen/tree/app-mobile"> app-mobile </a>

## Installation des modules
> npm install

## Configurer la connexion à la base de donnée en ligne:
1. Copier le fichier **.env.example** et renommer le fichier copié en **.env**
2. Remplacer le contenu de la variable d'environnement **DB_URL** avec celui fournis de la base de donnée
3. Ne pas push l'adresse de la base de donnée dans le fichier **.env.example**
4. Les informations de la base de donnée sont dans le fichier config/database.js
5. Si vous faites des test unitaires utiliser une base externe de test et non celui de l'application, vous devez donc ajouter le contenu dans DB_URL_TEST

## Migration
1. Installation de migrate-mongo : npm install -g migrate-mongo
2. Créer un dossier : migrations
3. Déplacer vous dans le dossier : cd ./migrations
4. Copier coller le fichier à l'intérieur du dossier migrations **migrate-mongo-config-example.js** et renommer le en **migrate-mongo-config.js**
5. Remplacer le contenu des paramètres **url** et **databaseName** avec celui fournis de la base de données
6. Surtout ne pusher pas les informations liées à l'url lorsque vous avez configurer le fichier

## Configuration des scripts de migrations
1. Toujours en étant dans le dossier migrations : cd ./migrations

2. Créer le fichier de migration pour la collection users en utilisant la commande : 
> migrate-mongo create users

3. Créer le fichier de migration pour la collection yeargroups en utilisant la commande : 
> migrate-mongo create yeargroups

4. Créer le fichier de migration pour la collection templates en utilisant la commande : 
> migrate-mongo create templates

5. Créer le fichier de migration pour la collection signoffsheets en utilisant la commande :
> migrate-mongo create signoffsheets

6. Créer le fichier de migration pour la collection assigns en utilisant la commande : 
> migrate-mongo create assigns

7. Copier le contenu des fichiers d'exemple de script de migration contenue dans le dossier ./ressources/migration

## Fonctionnement de migrate mongo

Exécuter toutes les migrations de base de données non appliquées
> migrate-mongo up

Annuler la dernière migration de base de données appliquées
> migrate-mongo down

Aficher le journal des modifications de la base de données
> migrate-mongo status

## Lancement du serveur

1. Environnement de développement : npm run dev
2. Environnement de production : npm start

## Documentation

Pour générer la documentation : npm run doc
