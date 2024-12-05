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
            controller: "controllerp",
        })

        //Admin Area
        .when("/admin/product", {
            templateUrl: "model/modeladminproduct.html",
            controller: "controlleradminproduct",
        })
        .when("/admin/ulist", {
            templateUrl: "model/modeladminulist.html",
            controller: "controlleradminproduct",
        })
        .when("/admin/plist", {
            templateUrl: "model/modeladminplist.html",
            controller: "controlleradminproduct",
        })
        .when("/admin/product/edit/:id", {
            templateUrl: "model/modeladminpedit.html",
            controller: "controllerpedit",
        })

        .otherwise("login");
});

app.controller("controllerlogin", function ($scope, $http, $location) {
    console.log("Login controller loaded");
    $scope.message = "Welcome to the Login Page!";

    $scope.loginData = {
        email: "",
        password: "",
    };

    $scope.errorMessage = "";
    $scope.submitLogin = function () {
        $http
            .post("http://localhost:8000/login", $scope.loginData)
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
                } else {
                    console.log("Cart is empty or not found.");
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
        }).catch(function(error) {
            console.log('Error updating quantity:', error);
            alert('Failed to update quantity. Please try again.');
        });
    };

    $scope.getCart();
});

app.controller("controlleradmin", function ($scope) {
    $scope.message = "Welcome to the Admin Page!";
});

app.controller("controllerproducthome", [
    "$scope",
    "$http",
    "$location",
    function ($scope, $http, $location) {
        $scope.products = [];
        $scope.maxProducts = 6;

        $http
            .get("http://localhost:8000/products")
            .then(function (response) {
                $scope.products = response.data;
            })
            .catch(function (error) {
                console.error("Error fetching products:", error);
            });

        $scope.loadMore = function () {
            $scope.maxProducts += 6;
        };
    },
]);

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
                quantity: quantity
            };
            console.log(productId),

            $http.post('http://localhost:8000/carts/'+ $scope.userId, cartData).then(function (response) {
                alert("Product added to cart successfully!");
            }, function (error) {
                alert("Failed to add product to cart.");
                console.error(error);
            });
        };

        $scope.loadComments = function () {
            $http
                .get(`http://localhost:8000/comments/${productId}`)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.comments = response.data.comments;
                    }
                })
                .catch(function (error) {
                    console.error("Error fetching comments:", error);
                });
        };
        
        $scope.commentRating = function () {
            if (!$scope.comment && !$scope.rating) {
                alert("Minimal salah satu, komentar atau rating, harus diisi.");
                return;
            }
    
            const commentData = {
                user_id: $scope.userId,
                product_id: productId,
                comment: $scope.comment,
                rating: $scope.rating,
            };
    
            $http.post("http://localhost:8000/comments/" + $scope.userId, commentData)
                .then(function (response) {
                    if (response.data.success) {
                        alert("Komentar berhasil ditambahkan!");
                        $scope.comment = "";
                        $scope.rating = 0;
                        // $scope.loadComments(); 
                    }
                })
                .catch(function (error) {
                    alert("Gagal mengirim komentar.");
                    console.error(error);
                });
        };
    
        // Load comments saat halaman dimuat
        // $scope.loadComments();
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

// app.controller("controllerproductdetail", [
//     "$scope",
//     "$http",
//     "$routeParams",
//     function ($scope, $http, $routeParams) {
//         $scope.products = {};

//         var productId = $routeParams.id;

//         $http
//             .get("http://localhost:8000/products/" + productId)
//             .then(function (response) {
//                 $scope.products = response.data;
//             })
//             .catch(function (error) {
//                 console.error("Error fetching product details:", error);
//                 $scope.errorMessage =
//                     "Failed to load product details. Please try again later.";
//             });
//     },
// ]);

app.run(function ($rootScope, $document, $timeout) {
    $rootScope.$on("$routeChangeSuccess", function (event, current) {
        var cssFile = "";
        switch (current.$$route.originalPath) {
            case "/login":
                cssFile = "modelstyle/modellogin.css";
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
            case "/productdetail":
                cssFile = "modelstyle/modelproductdetail.css";
                break;
            case "/profile":
                cssFile = "modelstyle/modelprofile.css";
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
