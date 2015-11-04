# Terra Arcana
http://www.gnterraarcana.com

Bienvenue au futur du site web de Terra Arcana! Le site refera prochainement peau neuve, avec un nouveau thème WordPress supportant des technologies modernes telles que **WP REST API**, **React.js** et **Konva**.

Avec celle nouvelle approche, nous nous tournons vers GitHub et la communauté open-source québécoise, pour faire de Terra Arcana le leader en site de GN au Québec.

## Installation
Vous devez d'abord avoir une installation vierge de [WordPress](http://fr.wordpress.org) sur votre poste.

Clonez le repositoire de Terra Arcana dans le dossier wp-content/themes/ de votre installation WordPress. Une fois le repositoire cloné, vous aurez besoin de [`npm`](http://npmjs.com) pour télécharger tous les modules externes (React, Webpack, etc.) nécessaires au fonctionnement du thème. Une fois que c'est installé, vous pourrez entrer la commande
`npm install` dans le dossier du repositoire pour télécharger les modules. Ils se retrouveront dans le dossier `node_modules`.

Le thème utilise [`webpack`](https://webpack.github.io/docs/) pour générer et minifier les fichiers sources. Lancez `webpack -w` dans un terminal séparé pour que les fichiers soient régénérés automatiquement à la sauvegarde.

## Structure
* `src`

   Tout le back-end PHP du thème. Le point d'entrée officiel de WordPress étant functions.php, celui-ci ne sert qu'à charger la classe mère de l'application, située à `src/controllers/main-controller.class.php`.

* `app`

   Tout le front-end Javascript/JSX. Les points d'entrée sont `app/app.js` et `app/index.html`.
   
* `lib`

   Sous-modules Git pour inclure des modules externes PHP. Contient actuellement TGM Plugin Activation pour gérer les plugins WordPress nécessaires au maintien du thème.
