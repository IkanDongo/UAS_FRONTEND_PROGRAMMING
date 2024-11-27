var app = angular.module('myApp', ['ngRoute']);

app.config(function($httpProvider) {
    $httpProvider.interceptors.push('csrfInterceptor');
});

app.service('AuthService', function ($http, $window) {
    const service = this;

    service.login = function (credentials) {
        return $http.post('/login', credentials).then(function (response) {
            if (response.data.success) {
                $window.localStorage.setItem('is_admin', response.data.data.is_admin);
                return response.data.data;
            } else {
                throw new Error(response.data.message);
            }
        });
    };

    service.isAdmin = function () {
        return $window.localStorage.getItem('is_admin') === 'true';
    };
});

app.factory('csrfInterceptor', function($q) {
    var csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    return {
        request: function(config) {
            if (config.method === 'POST' || config.method === 'PUT' || config.method === 'DELETE' || config.method === 'PATCH') {
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
    .when('/createuser', {
        templateUrl: 'model/modelcreate.html',
        controller: 'controllercreateuser'
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
 
    //Admin Area
    .when('/admin/product', {
        templateUrl: 'model/modeladminproduct.html',
        controller: 'controlleradminproduct'
    })
    .when('/admin/ulist', {
        templateUrl: 'model/modeladminulist.html',
        controller: 'controlleradminproduct'
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
                    if (response.data.user.is_admin) {
                        $location.path('/admin'); 
                    } else {
                        $location.path('/home'); 
                    }
                } else {
                    console.log("Login failed:", response.data.message);
                    $scope.errorMessage = response.data.message || 'Login failed. Please try again.';
                }
            })
            .catch(function(error) {
                console.error("Login error:", error);
                $scope.errorMessage = error.data?.message || 'An error occurred during login.';
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

app.controller('controlleradminproduct', ['$scope', '$http', function($scope, $http) {
    $scope.product = {
        name: '',
        description: '',
        category: '',
        price: '',
        stock: ''
    };

    $scope.submitCreateProduct = function() {
        $http.post('http://localhost:8000/products', $scope.product)
            .then(function(response) {
                if (response.data.success) {
                    console.log("Product created successfully");
                    $scope.successMessage = "Product created successfully!";
                    $scope.product = {}; 
                } else {
                    console.log("Product creation failed:", response.data.message);
                    $scope.errorMessage = response.data.message || 'Product creation failed.';
                }
            })
            .catch(function(error) {
                console.error("Product creation error:", error);
                $scope.errorMessage = error.data.message || 'An error occurred while creating the product.';
            });
    };
}]);

app.controller('controllerulist', function($scope, $http) {
    $scope.users = [];

    $http.get('http://localhost:8000/users')
        .then(function (response) {
            $scope.users = response.data;
        })
        .catch(function (error) {
            console.error('Error fetching users:', error);
        });

    $scope.toggleAdmin = function(userId) {
        $http.patch('http://localhost:8000/users/' + userId + '/toggleAdmin')
            .then(function (response) {
                let user = $scope.users.find(u => u._id === userId);
                if (user) {
                    user.is_admin = !user.is_admin;
                }
                console.log(response.data.message);
            })
            .catch(function (error) {
                console.error('Error toggling admin:', error);
            });
    };

    $scope.removeUser = function(userId) {
        $http.delete('http://localhost:8000/users/' + userId)
            .then(function (response) {
                $scope.users = $scope.users.filter(u => u._id !== userId);
                console.log(response.data.message);
            })
            .catch(function (error) {
                console.error('Error deleting user:', error);
            });
    };
});


app.controller('controllercreateuser', function($scope, $http, $location) {
    $scope.createAccountData = {
        name: '',
        email: '',
        password: ''
    };

    $scope.submitCreateAccount = function() {
        $http.post('http://localhost:8000/users', $scope.createAccountData)
            .then(function(response) {
                if (response.data.success) {
                    console.log("Account created successfully");
                    $location.path('/login');
                } else {
                    console.log("Account creation failed:", response.data.message);
                    $scope.errorMessage = response.data.message;
                }
            })
            .catch(function(error) {
                console.error("Account creation error:", error);
                $scope.errorMessage = 'An error occurred while creating the account.';
            });
    };
});

app.run(function($rootScope, $document, $timeout) {
    $rootScope.$on('$routeChangeSuccess', function(event, current) {
        var cssFile = '';
        switch (current.$$route.originalPath) {
            case '/login':
                cssFile = 'modelstyle/modellogin.css';
                break;
            case '/createuser':
                cssFile = 'modelstyle/modelcreate.css';
                break;
            case '/home':
                cssFile = 'modelstyle/modelhome.css';
                break;
            case '/admin':
                cssFile = 'modelstyle/modeladmin.css';
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
            var oldLinks = head.querySelectorAll('link[rel="stylesheet"][data-dynamic="true"]');
            oldLinks.forEach(function(link) {
                head.removeChild(link);
            });

            $timeout(function() {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = cssFile;
                link.setAttribute('data-dynamic', 'true');
                head.appendChild(link);

                link.onload = function() {
                    console.log(`${cssFile} loaded successfully.`);
                };
            }, 100); 
        }
    });
});

