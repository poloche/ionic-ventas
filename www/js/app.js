
// Database instance.
var db;

// Include dependency: ngCordova
var ventas = angular.module('starter', ['ionic', 'aquarellaControllers','aquarellaServices','ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        db = $cordovaSQLite.openDB("aquarella.db");
        $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS persona (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, apellido TEXT,direccion TEXT, phone TEXT, balance DOUBLE, estado BOOLEAN)');
        $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS pedido (id INTEGER PRIMARY KEY AUTOINCREMENT, persona INTEGER, fecha date, total DOUBLE, estado BOOLEAN)');
        $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS pago (id INTEGER PRIMARY KEY AUTOINCREMENT, fecha date, total DOUBLE, estado BOOLEAN)');
        $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS producto (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, detalle TEXT,catalogo TEXT, pagina INTEGER, precio INTEGER, estado BOOLEAN)');
        $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS item (id INTEGER PRIMARY KEY AUTOINCREMENT, producto INTEGER, pedido INTEGER, precio DOUBLE, cantidad INTEGER)');

    });
});

ventas.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
      .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "js/views/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.credits', {
    url: '/credits',
    views: {
      'credits': {
        templateUrl: 'js/views/credits.html',
        controller: 'CreditsController'
      }
    }
  })

  .state('tab.people', {
      url: '/people',
      views: {
        'people': {
          templateUrl: 'js/views/people.html',
          controller: 'PeopleController'
        }
      }
    })
    .state('tab.product', {
      url: '/product',
      views: {
        'products': {
          templateUrl: 'js/views/products.html',
          controller: 'ProductController'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/credits');

});
