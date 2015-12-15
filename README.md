# Terra Arcana
http://www.gnterraarcana.com

Bienvenue au futur du site web de Terra Arcana! Le site refera prochainement peau neuve, avec un nouveau thème WordPress supportant des technologies modernes telles que **WP REST API**, **ReactJS** et **Konva**.

Avec celle nouvelle approche, nous nous tournons vers GitHub et la communauté open-source québécoise, pour faire de Terra Arcana le leader en site de GN au Québec.

## Installation

1. Téléchargez [WordPress](http://fr.wordpress.org) sur votre poste. Une installation vierge est suggérée.

2. Suivez la procédure d'installation de WordPress pour vous créer un compte administrateur et générer une base de données MySQL.

3. **Si votre installation d'Apache est manuelle** (c'est-à-dire pas WAMP, MAMP, XAMPP, ou etc):
  * Assurez-vous dans votre fichier `httpd.conf` que AllowOverride est bien configuré à All et non à None pour votre dossier qui vous sert de racine web (normalement `htdocs` ou `/var/www`)
  
4. Clonez le repositoire de Terra Arcana dans le dossier wp-content/themes/ de votre installation WordPress.

5. Exécutez les commandes suivantes pour installer toutes les dépendances du projet (installez préalablement [NPM](https://www.npmjs.com) et [Composer](https://getcomposer.org) si ce n'est pas déjà fait):
```bash
npm install             // Installe toutes les dépendances JavaScript dans /node_modules
npm install -g webpack  // Installe webpack globalement (nécessaire pour générer les fichiers HTML/CSS/JS distribués)
npm install -g esdoc    // Installe esdoc globalement (nécessaire pour générer la documentation)
composer install        // Installe toutes les dépendances PHP dans /vendor
webpack                 // Génère une première fois les fichiers distribués dans /dist et la documentation dans /docs
```

6. Connectez-vous dans le panneau d'administration de WordPress (à `{votre URL local}/wp-admin`) et rendez-vous dans Apparence dans le menu de gauche pour activer le thème Terra Arcana.

## Développement

Le thème utilise [webpack](https://webpack.github.io/docs/) pour transpiler les fichiers sources en fichiers distribués, ainsi que générer la documentation du projet. Lancez `webpack --progress -w` dans un terminal séparé pour que vos changements régénèrent automatiquement à la sauvegarde les fichiers distribués.

Le projet utilise également [ESLint](http://eslint.org/) pour vérifier la syntaxe des fichiers sources, et est lancé par webpack à chaque sauvegarde. Assurez-vous que votre code passe tous les tests de syntaxe avant de soumettre vos commits.

La documentation du projet est générée par [ESDoc](https://esdoc.org), et est disponible dans le dossier `docs` de votre projet une fois webpack exécuté au moins une fois. Consultez [la documentation](https://esdoc.org/tags.html) pour la liste des tags disponibles.

## Arborescence
* `src`  
   Tout le back-end PHP du thème. Le point d'entrée officiel de WordPress étant functions.php, celui-ci ne sert qu'à charger la classe mère de l'application, située à `src/controllers/main-controller.class.php`.

* `app`  
   Tout le front-end Javascript/JSX. Les points d'entrée sont `app/app.js` et `app/index.html`.

* `acf-json`  
  Fichiers JSON générés par [ACF Pro](http://www.advancedcustomfields.com) représentant les modèles de données des [types de contenu](https://codex.wordpress.org/Post_Types) créés par le thème. Ne pas toucher directement.
