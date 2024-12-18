var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push("csrfInterceptor");
});

app.service("AuthService", function ($http, $window) {
    const service = this;

    service.login = function (credentials) {
        return $http.post("/login", credentials).then(function (response) {
            if (response.data.success) {
                $window.localStorage.setItem(
                    "is_admin",
                    response.data.data.is_admin
                );
                return response.data.data;
            } else {
                throw new Error(response.data.message);
            }
        });
    };

    service.isAdmin = function () {
        return $window.localStorage.getItem("is_admin") === "true";
    };
});

app.factory("csrfInterceptor", function ($q) {
    var csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

    return {
        request: function (config) {
            if (
                config.method === "POST" ||
                config.method === "PUT" ||
                config.method === "DELETE" ||
                config.method === "PATCH"
            ) {
                config.headers["X-CSRF-TOKEN"] = csrfToken;
            }
            return config;
        },

        responseError: function (rejection) {
            return $q.reject(rejection);
        },
    };
});

app.config(function ($routeProvider) {
    $routeProvider
        .when("/login", {
            templateUrl: "model/modellogin.html",
            controller: "controllerlogin",
        })
        .when("/createuser", {
            templateUrl: "model/modelcreate.html",
            controller: "controllercreateuser",
        })
        .when("/home", {
            templateUrl: "model/modelhome.html",
            controller: "controllerhome",
        })
        .when("/producthome", {
            templateUrl: "model/modelproducthome.html",
            controller: "controllerproducthome",
        })
        .when("/productdetail/:id", {
            templateUrl: "model/modelproductdetail.html",
            controller: "controllerproductdetail",
        })
        .when("/profile", {
            templateUrl: "model/modelprofile.html",
            controller: "controllerprofile",
        })
        .when("/cart", {
            templateUrl: "model/modelcart.html",
            controller: "controllercart",
        })
        .when("/admin", {
            templateUrl: "model/modeladmin.html",
            controller: "controlleradmin",
        })
        .when("/product/edit/:id", {
            templateUrl: "model/modeladminpedit.html",
            controller: "controllerpedit",
        })
        .when("/forgot", {
            templateUrl: "model/modelforgot.html",
            controller: "controllerforgot",
        })

        //Admin Area
        .when("/admin/product", {
            templateUrl: "model/modeladminproduct.html",
            controller: "controlleradminproduct",
        })
        .when("/admin/ulist", {
            templateUrl: "model/modeladminulist.html",
            controller: "controllerulist",
        })
        .when("/admin/plist", {
            templateUrl: "model/modeladminplist.html",
            controller: "controllerplist",
        })
        .when("/admin/product/edit/:id", {
            templateUrl: "model/modeladminpedit.html",
            controller: "controllerpedit",
        })
        .when("/admin/ttlist", {
            templateUrl: "model/modeladminttlist.html",
            controller: "controlleradminttlist",
        })
        .when("/admin/tips-trik/edit/:id", {
            templateUrl: "model/modeladminttedit.html",
            controller: "controlleradminttedit",
        })
        .when("/admin/tipstrik", {
            templateUrl: "model/modeladminttcreate.html",
            controller: "controlleradmintipstrik",
        })

        .otherwise("login");
});

app.controller("controllerforgot", function ($scope, $http, $location) {
    $scope.forgotPasswordData = {};

    $scope.forgotPassword = function () {
        if ($scope.forgotPasswordData.password !== $scope.forgotPasswordData.confirm_password) {
            alert("Passwords do not match!");
            return;
        }

        $http.post("http://localhost:8000/forget-password", $scope.forgotPasswordData)
            .then(function (response) {
                alert('Password has been reset successfully!');
                $scope.forgotPasswordData = {};
                $location.path('/login');
            })
            .catch(function (error) {
                console.error('Error resetting password:', error);
                alert('Failed to reset password');
            });
    };
});

app.controller("controlleradmintipstrik", [
    "$scope",
    "$http",
    function ($scope, $http) {
        $scope.tipstriks = {
            name: "", 
            title: "", 
            content: "",
        };

        $scope.imageFile = null;

        $scope.setImageFile = function (element) {
            $scope.imageFile = element.files[0];
        };

        $scope.submitCreateTipstriks = function () {
            let formData = new FormData();
            formData.append("name", $scope.tipstriks.name);
            formData.append("title", $scope.tipstriks.title);
            formData.append("content", $scope.tipstriks.content);
            if ($scope.imageFile) {
                formData.append("image", $scope.imageFile);
            }

            $http
                .post("http://localhost:8000/tips-trik", formData, {
                    headers: { "Content-Type": undefined },
                    transformRequest: angular.identity,
                })
                .then(function (response) {
                    console.log("tips-trick created successfully:", response.data);
                    $scope.successMessage = "Tips & Trik created successfully!";
                    $scope.tipstriks = {};
                    $scope.imageFile = null;
                    document.getElementById("image").value = ""; 
                })
                .catch(function (error) {
                    console.error("Error creating tips-trick:", error);
                    $scope.errorMessage =
                        error.data?.message || "An error occurred while creating the Tips & Trik.";
                });
        };
    },
]);


app.controller("controlleradminttlist", [
    "$scope",
    "$http",
    "$location",
    function ($scope, $http, $location) {
        $scope.tipstrik = [];

    $http
        .get("http://localhost:8000/tips-trik")
        .then(function (response) {
            $scope.tipstriks = response.data;
        })
        .catch(function (error) {
            console.error("Error fetching tipstriks:", error);
        });
         $scope.goToEditTipstriks = function (tipstriksId) {
            $location.path("/admin/tips-trik/edit/" + tipstriksId);
        };
        $scope.removeTipstriks = function (tipstriksId) {
            $http
                .delete("http://localhost:8000/tips-trik/" + tipstriksId)
                .then(function (response) {
                    $scope.tipstriks = $scope.tipstriks.filter(
                        (t) => t._id !== tipstriksId
                    );
                    console.log(response.data.message);
                })
                .catch(function (error) {
                    console.error("Error deleting tipstriks:", error);
                });
        };
    },
]);


app.controller("controlleradminttedit", [
    "$scope",
    "$http",
    "$routeParams",
    "$location",
    function ($scope, $http, $routeParams, $location) {
        const tipstrikId = $routeParams.id;


        $scope.tipstriks = {
            name: "",
            title: "",
            content: "",
        };


        $http
            .get("http://localhost:8000/tips-trik/" + tipstrikId)
            .then(function (response) {
                $scope.tipstrik = response.data; 
            })
            .catch(function (error) {
                console.error("Error fetching tipstrik details:", error);
            });

  
        $scope.updateTipstrik = function () {
            $http
                .put(
                    "http://localhost:8000/tips-trik/" + tipstrikId,
                    $scope.tipstriks
                )
                .then(function (response) {
                    if (
                        response.data.success ||
                        response.data.message ===
                            "Tips-Trik updated successfully"
                    ) {
                        console.log("Tips-Trik updated successfully");
                        $location.path("/admin/ttlist");
                    } else {
                        console.error(
                            "Tips-Trik update failed:",
                            response.data.message
                        );
                    }
                })
                .catch(function (error) {
                    console.error("Error updating tips-trik:", error);
                });
        };

   
        $scope.cancel = function () {
            $location.path("/admin/ttlist");
        };
    },
]);



app.controller("controllerlogin", function ($scope, $http, $location) {
    console.log("Login controller loaded");
    $scope.message = "Welcome to the Login Page!";

    $scope.loginData = {
        email: "",
        password: "",
    };

    $scope.errorMessage = "";
    $scope.submitLogin = function () {
        $http.post("http://localhost:8000/login", $scope.loginData)
            .then(function (response) {
                console.log("Response Data:", response.data);
                localStorage.setItem("user_id", response.data.user.id);

                if (response.data.success === true) {
                    if (response.data.user.is_admin) {
                        $location.path("/admin");
                    } else {
                        $location.path("/home");
                    }
                } else {
                    console.log("Login failed:", response.data.message);
                    $scope.errorMessage =
                        response.data.message ||
                        "Login failed. Please try again.";
                }
            })
            .catch(function (error) {
                console.error("Login error:", error);
                $scope.errorMessage =
                    error.data?.message || "An error occurred during login.";
            });
    };
});

app.controller("controllerhome", function ($scope) {
    $scope.message = "Welcome to the Home Page!";
});

app.controller("controllerprofile", function ($scope, $http) {
    console.log("Profile controller loaded");

    $scope.message = "Welcome to the Profile Page!";
    $scope.user = {}; 
    $scope.errorMessage = "";

    const userId = localStorage.getItem("user_id");

    if (userId) {
        $http
            .get(`http://localhost:8000/users/${userId}`)
            .then(function (response) {
                console.log("User Data:", response.data);
                $scope.user = response.data;
            })
            .catch(function (error) {
                console.error("Error fetching user data:", error);
                $scope.errorMessage =
                    error.data?.message || "Unable to fetch user data.";
            });
    } else {
        $scope.errorMessage = "User ID not found in localStorage.";
    }
});


app.controller("controllercart", function ($scope, $http) {
    $scope.cart = [];
    $scope.totalItems = 0;
    $scope.totalPrices = 0;

    var user_id = localStorage.getItem("user_id");

    $scope.getCart = function () {
        $http
            .get("http://localhost:8000/carts/" + user_id)
            .then(function (response) {
                if (
                    response.data.cart_data &&
                    response.data.cart_data.length > 0
                ) {
                    $scope.cart = response.data.cart_data;
                    $scope.countTotalItems();
                    $scope.countTotalPrices();
                } else {
                    console.log("Cart is empty or not found.");
                    $scope.cart = [];
                    $scope.totalItems = 0;
                    $scope.totalPrices = 0;
                }
            })
            .catch(function (error) {
                console.log("Error:", error);
            });
    };

    $scope.removeItem = function (cart) {
        console.log(cart);
        var cart_id = cart.cart_id;
        console.log(cart_id);
        $http.delete("http://localhost:8000/carts/" + user_id + "/" + cart_id)
            .then(function (response) {
                console.log("Item removed successfully:", response.data);
                $scope.cart = $scope.cart.filter(function (cartItem) {
                    return cartItem.cart_id !== cart_id;
                });
                $scope.countTotalItems();
                $scope.countTotalPrices();
                $scope.getCart();
            })
            .catch(function (error) {
                console.log("Error removing item:", error);
            });
    };
    
    $scope.changeQuantity = function(item, newQuantity) {
        if (newQuantity < 1) {
            alert("Quantity cannot be less than 1.");
            return;
        }
    
        var itemId = item.product.product_id;
    
        $http.patch('http://localhost:8000/carts/' + user_id + '/' + itemId, {
            quantity: newQuantity
        }).then(function(response) {
            console.log('Quantity updated successfully:', response.data);
            item.quantity = newQuantity;
            $scope.countTotalItems();
            $scope.countTotalPrices();
        }).catch(function(error) {
            console.log('Error updating quantity:', error);
            alert('Failed to update quantity. Please try again.');
        });
    };

    $scope.checkoutCart = function () {
        if ($scope.cart.length === 0) {
            alert("Your cart is empty. Please add items to the cart before checking out.");
            return;
        }
    
        const checkoutData = {
            user_id: user_id,
            cart: $scope.cart.map(item => ({
                product: { product_id: item.product.product_id },
                quantity: item.quantity
            }))
        };
    
        console.log("Checkout Data:", checkoutData);
    
        $http.post("http://localhost:8000/checkout", checkoutData)
            .then(function (response) {
                console.log("Checkout successful:", response.data);
                alert("Checkout successful!");
                $scope.cart = [];
                $scope.totalItems = 0;
                $scope.totalPrices = 0;
            })
            .catch(function (error) {
                console.error("Checkout failed:", error);
    
                if (error.data && error.data.message) {
                    alert("Checkout failed: " + error.data.message);
                } else {
                    alert("Checkout failed. Please try again.");
                }
            });
    };
    
    
    

    $scope.countTotalItems = function () {
        $scope.totalItems = $scope.cart.reduce(function (total, item) {
            return total + item.quantity; 
        }, 0);
    };

    $scope.countTotalPrices = function () {
        $scope.totalPrices = $scope.cart.reduce(function (price, item) {
            return price + (item.product.price * item.quantity); 
        }, 0);
    };

    $scope.getCart();
});

app.controller("controlleradmin", function ($scope) {
    $scope.message = "Welcome to the Admin Page!";
});

app.controller('controllerproducthome', ['$scope', '$http', function($scope, $http) {
    $scope.products = [];
    $scope.filteredProducts = [];
    $scope.maxProducts = 6;
    
    $scope.sortField = 'name'; 
    $scope.sortReverse = false;
    $scope.searchQuery = ''; 

    $http.get('http://localhost:8000/products')
        .then(function(response) {
            $scope.products = response.data;
            $scope.filterAndSort(); 
        })
        .catch(function(error) {
            console.error('Error fetching products:', error);
        });


    $scope.filterAndSort = function() {
        let filtered = $scope.products;
        

        if ($scope.searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes($scope.searchQuery.toLowerCase())
            );
        }
        
        if ($scope.selectedCategory) {
            filtered = filtered.filter(product =>
                product.category === $scope.selectedCategory
            );
        }


       filtered = filtered.sort((a, b) => {
            let valueA = a[$scope.sortField];
            let valueB = b[$scope.sortField];

            
            if ($scope.sortField === 'price') {
                valueA = parseFloat(valueA) || 0; 
                valueB = parseFloat(valueB) || 0;
            }

            if (valueA < valueB) return $scope.sortReverse ? 1 : -1;
            if (valueA > valueB) return $scope.sortReverse ? -1 : 1;
            return 0;
        });

        $scope.filteredProducts = filtered.slice(0, $scope.maxProducts); 
    };


    $scope.toggleSort = function(field) {
        if ($scope.sortField === field) {
            $scope.sortReverse = !$scope.sortReverse;
        } else {
            $scope.sortField = field;
            $scope.sortReverse = false;
        }
        $scope.filterAndSort();
    };
    
    $scope.loadMore = function() {
        $scope.maxProducts += 6;
        $scope.filterAndSort();
    };
}]);




app.controller("controllerproductdetail", [
    "$scope",
    "$http",
    "$routeParams",
    function ($scope, $http, $routeParams) {
        $scope.comments = [];
        $scope.comment = "";
        $scope.rating = 0;
        $scope.userId = localStorage.getItem("user_id"); 
        var productId = $routeParams.id; 

        $http.get("http://localhost:8000/products/" + productId)
            .then(function (response) {
                $scope.products = response.data;
            })
            .catch(function (error) {
                console.error("Error fetching product details:", error);
                $scope.errorMessage =
                    "Failed to load product details. Please try again later.";
            });

        $scope.addItemToCart = function (product, quantity) {
            const cartData = {
                product_id: product._id,
                quantity: quantity,
            };
            console.log(productId),

            $http.post('http://localhost:8000/carts/'+ $scope.userId, cartData).then(function (response) {
                alert("Product added to cart successfully!");
            }, function (error) {
                alert("Failed to add product to cart.");
                console.error(error);
            });
        };

        $scope.commentRating = function () {
            if (!$scope.comment && !$scope.rating) {
                alert("At least one of them, comment or rating, must be filled in.");
                return;
            }
    
            const commentData = {
                user_id: $scope.userId,
                product_id: productId,
                comment: $scope.comment,
                rating: $scope.rating,
                rating: $scope.rating,
            };
    
            $http.post("http://localhost:8000/comments/" + $scope.userId, commentData)
                .then(function (response) {
                    if (response.data.success) {
                        alert("Komentar created successfully!");
                        $scope.comment = "";
                        $scope.rating = 0;
                    }
                })
                .catch(function (error) {
                    alert("An error occurred while creating the Comment.");
                    console.error(error);
                });
        };
    }
]);

app.controller("controlleradminproduct", [
    "$scope",
    "$http",
    function ($scope, $http) {
        $scope.product = {
            name: "",
            description: "",
            category: "",
            price: "",
            stock: "",
        };

        $scope.imageFile = null;

        $scope.setImageFile = function (element) {
            $scope.imageFile = element.files[0];
        };

        $scope.submitCreateProduct = function () {
            let formData = new FormData();
            formData.append("name", $scope.product.name);
            formData.append("description", $scope.product.description || "");
            formData.append("category", $scope.product.category);
            formData.append("price", $scope.product.price);
            formData.append("stock", $scope.product.stock);
            if ($scope.imageFile) {
                formData.append("image", $scope.imageFile);
            }

            $http
                .post("http://localhost:8000/products", formData, {
                    headers: { "Content-Type": undefined },
                    transformRequest: angular.identity,
                })
                .then(function (response) {
                    console.log("Product created successfully:", response.data);
                    $scope.successMessage = "Product created successfully!";
                    $scope.product = {};
                    $scope.imageFile = null;
                })
                .catch(function (error) {
                    console.error("Product creation error:", error);
                    $scope.errorMessage =
                        error.data.message ||
                        "An error occurred while creating the product.";
                });
        };
    },
]);

app.controller("controllerplist", [
    "$scope",
    "$http",
    "$location",
    function ($scope, $http, $location) {
        $scope.product = [];

        $http
            .get("http://localhost:8000/products")
            .then(function (response) {
                $scope.products = response.data;
            })
            .catch(function (error) {
                console.error("Error fetching products:", error);
            });

        $scope.goToEditProduct = function (productsId) {
            $location.path("/admin/product/edit/" + productsId);
        };

        $scope.removeProducts = function (productsId) {
            $http
                .delete("http://localhost:8000/products/" + productsId)
                .then(function (response) {
                    $scope.products = $scope.products.filter(
                        (p) => p._id !== productsId
                    );
                    console.log(response.data.message);
                })
                .catch(function (error) {
                    console.error("Error deleting product:", error);
                });
        };
    },
]);

app.controller("controllerpedit", [
    "$scope",
    "$http",
    "$routeParams",
    "$location",
    function ($scope, $http, $routeParams, $location) {
        const productId = $routeParams.id;

        $scope.products = {
            name: "",
            description: "",
            category: "",
            price: "",
            stock: "",
            image: "",
        };

        $http
            .get("http://localhost:8000/products/" + productId)
            .then(function (response) {
                $scope.product = response.data;
            })
            .catch(function (error) {
                console.error("Error fetching product details:", error);
            });

        $scope.updateProduct = function () {
            $http
                .put(
                    "http://localhost:8000/products/" + productId,
                    $scope.products
                )
                .then(function (response) {
                    if (
                        response.data.success ||
                        response.data.message ===
                            "Products updated successfully"
                    ) {
                        console.log("Product updated successfully");
                        $location.path("/admin/plist");
                    } else {
                        console.error(
                            "Product update failed:",
                            response.data.message
                        );
                    }
                })
                .catch(function (error) {
                    console.error("Error updating product:", error);
                });
        };

        $scope.cancel = function () {
            $location.path("/admin/plist");
        };
    },
]);

app.controller("controllerulist", function ($scope, $http) {
    $scope.users = [];

    $http
        .get("http://localhost:8000/users")
        .then(function (response) {
            $scope.users = response.data;
        })
        .catch(function (error) {
            console.error("Error fetching users:", error);
        });

    $scope.toggleAdmin = function (userId) {
        $http
            .patch("http://localhost:8000/users/" + userId + "/toggleAdmin")
            .then(function (response) {
                let user = $scope.users.find((u) => u._id === userId);
                if (user) {
                    user.is_admin = !user.is_admin;
                }
                console.log(response.data.message);
            })
            .catch(function (error) {
                console.error("Error toggling admin:", error);
            });
    };

    $scope.removeUser = function (userId) {
        $http
            .delete("http://localhost:8000/users/" + userId)
            .then(function (response) {
                $scope.users = $scope.users.filter((u) => u._id !== userId);
                console.log(response.data.message);
            })
            .catch(function (error) {
                console.error("Error deleting user:", error);
            });
    };
});

app.controller("controllercreateuser", function ($scope, $http, $location) {
    $scope.createAccountData = {
        name: "",
        email: "",
        password: "",
    };
    $scope.submitCreateAccount = function () {
        $http
            .post("http://localhost:8000/users", $scope.createAccountData)
            .then(function (response) {
                if (response.data.success) {
                    console.log("Account created successfully");
                    $location.path("/login");
                } else {
                    console.log(
                        "Account creation failed:",
                        response.data.message
                    );
                    $scope.errorMessage = response.data.message;
                }
            })
            .catch(function (error) {
                console.error("Account creation error:", error);
                $scope.errorMessage =
                    "An error occurred while creating the account.";
            });
    };
});

app.controller("controllerprofile", function ($scope, $http) {
    console.log("Profile controller loaded");

    $scope.message = "Welcome to the Profile Page!";
    $scope.user = {};
    $scope.editUser = {};
    $scope.errorMessage = "";

    const userId = localStorage.getItem("user_id");

    if (userId) {
        $http
            .get(`http://localhost:8000/users/${userId}`)
            .then(function (response) {
                console.log("User Data:", response.data);
                if (response.data.status) {
                    $scope.user = response.data.user;
                } else {
                    $scope.errorMessage = "User data could not be fetched.";
                }
            })
            .catch(function (error) {
                console.error("Error fetching user data:", error);
                $scope.errorMessage = error.data?.message || "Unable to fetch user data.";
            });
    } else {
        $scope.errorMessage = "User ID not found in localStorage.";
    }

  
    $scope.toggleEdit = function () {
        $scope.editUser = angular.copy($scope.user); 
        const modal = new bootstrap.Modal(document.getElementById("editProfileModal"));
        modal.show();
    };

    
  $scope.saveProfile = function () {
    $http
        .put(`http://localhost:8000/users/${userId}`, $scope.editUser)
        .then(function (response) {
            if (response.status === 200 && response.data.success) {
                alert("Profile updated successfully!");
                window.location.reload();
            } else {
                alert("Failed to update profile.");
            }
        })
        .catch(function (error) {
            console.error("Error updating profile:", error);
            alert(error.data?.message || "An error occurred while updating the profile.");
        });

    const modal = bootstrap.Modal.getInstance(document.getElementById("editProfileModal"));
    modal.hide();
};

});

app.run(function ($rootScope, $document, $timeout) {
    $rootScope.$on("$routeChangeSuccess", function (event, current) {
        var cssFile = "";
        switch (current.$$route.originalPath) {
            case "/login":
                cssFile = "modelstyle/modellogin.css";
                break;
            case "/forgot":
                cssFile = "modelstyle/modelforgot.css";
                break;
            case "/createuser":
                cssFile = "modelstyle/modelcreate.css";
                break;
            case "/home":
                cssFile = "modelstyle/modelhome.css";
                break;
            case "/admin":
                cssFile = "modelstyle/modeladmin.css";
                break;
            case "/admin/ulist":
                cssFile = "modelstyle/modeladminulist.css";
                break;
            case "/admin/plist":
                cssFile = "modelstyle/modeladminplist.css";
                break;
            case "/product":
                cssFile = "modelstyle/modelproduct.css";
                break;
            case "/profile":
                cssFile = "modelstyle/modelprofile.css";
                break;
            case "/producthome":
                cssFile = "modelstyle/modelproducthome.css";
                break;
            case "/productdetail/:id":
                cssFile = "modelstyle/modelproductdetail.css";
                break;
            case "/admin/product":
                cssFile = "modelstyle/modelproduct.css";
                break;
            case "/product/edit/:id":
                cssFile = "modelstyle/modeladminpedit.css";
                break;
            case "/cart":
                cssFile = "modelstyle/modelcart.css";
                break;
            case "/admin/ttlist":
                cssFile = "modelstyle/modeladminplist.css";
                break;
        }

        if (cssFile) {
            var head = $document[0].head;
            var oldLinks = head.querySelectorAll(
                'link[rel="stylesheet"][data-dynamic="true"]'
            );
            oldLinks.forEach(function (link) {
                head.removeChild(link);
            });
            $timeout(function () {
                var link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = cssFile;
                link.setAttribute("data-dynamic", "true");
                head.appendChild(link);

                link.onload = function () {
                    console.log(`${cssFile} loaded successfully.`);
                };
            }, 100);
        }
    });
});
