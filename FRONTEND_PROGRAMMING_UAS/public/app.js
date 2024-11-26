var app = angular.module('myApp', ['ngRoute']);

app.config(function($httpProvider) {
    $httpProvider.interceptors.push('csrfInterceptor');
});

app.factory('csrfInterceptor', function($q) {
    var csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    return {
        request: function(config) {
            if (config.method === 'POST' || config.method === 'PUT' || config.method === 'DELETE') {
                config.headers['X-CSRF-TOKEN'] = csrfToken;
            }
            return config;
        },

        responseError: function(rejection) {
            return $q.reject(rejection);
        }
    };
});

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
    .otherwise('login');
});

app.controller('controllerlogin', function($scope, $http, $location) {
    console.log("Login controller loaded");
    $scope.message = "Welcome to the Login Page!";

    $scope.loginData = {
        email: '',
        password: ''
    };

    $scope.errorMessage = '';

    $scope.submitLogin = function() {
        $http.post('http://localhost:8000/login', $scope.loginData)
            .then(function(response) {
                console.log("Response Data:", response.data);

                if (response.data.success === true) {
                    $location.path('/home');
                } else {
                    console.log("Login failed:", response.data.message);
                    $scope.errorMessage = response.data.message || 'Login failed. Please try again.';
                }
            })
            .catch(function(error) {
                console.error("Login error:", error);
                $scope.errorMessage = error.data.message || 'An error occurred during login.';
            });
    };
});


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
