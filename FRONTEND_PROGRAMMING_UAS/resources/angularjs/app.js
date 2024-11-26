var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    .when('/login', {
        templateUrl: 'model/modellogin.html',
        controller: 'controllerlogin'
    })
    .when('/home', {
        templateUrl: 'model/modelhome.html',
        controller: 'controllerhome'
    })
    .when('/product', {
        templateUrl: 'model/modelproduct.html',
        controller: 'controllerproduct'
    })
    .when('/profile', {
        templateUrl: 'model/modelprofile.html',
        controller: 'controllerprofile'
    })
    .when('/cart', {
        templateUrl: 'model/modelcart.html',
        controller: 'controllercart'
    })
    .when('/admin', {
        templateUrl: 'model/modeladmin.html',
        controller: 'controlleradmin'
    })
    .otherwise('login')
});

app.controller('controllerlogin', function($scope) {
    console.log("Login controller loaded");
    $scope.message = "Welcome to the Login Page!";
});
// app.controller('controllerlogin', ['$scope', function($scope) {
//     $scope.message = "Welcome to the Login Page!";
// }]);

app.controller('controllerhome', function($scope) {
    $scope.message = "Welcome to the Home Page!";
});

app.controller('controllerprofile', function($scope) {
    $scope.message = "Welcome to the Profile Page!";
});

app.controller('controllercart', function($scope) {
    $scope.message = "Welcome to the Admin Page!";
});

app.controller('controlleradmin', function($scope) {
    $scope.message = "Welcome to the Admin Page!";
});


app.run(function($rootScope, $document) {
    $rootScope.$on('$routeChangeSuccess', function(event, current) {
        var cssFile = '';
        switch (current.$$route.originalPath) {
            case '/login':
                cssFile = 'modelstyle/modellogin.css';
                break;
            case '/home':
                cssFile = 'modelstyle/modelhome.css';
                break;
            case '/product':
                cssFile = 'modelstyle/modelproduct.css';
                break;
            case '/profile':
                cssFile = 'modelstyle/modelprofile.css';
                break;
        }
        if (cssFile) {
            var head = $document[0].head;
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssFile;
            head.appendChild(link);
        }
    });
});
