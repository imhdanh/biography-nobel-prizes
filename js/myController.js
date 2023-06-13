// Danh
// Khai bao Angular App
var app = angular.module("myApp", ["ngRoute"]);
// app.config(function ($routeProvider, $locationProvider) {
app.config(function ($routeProvider) {
  $routeProvider
    .when("/", { templateUrl: "/views/home.html" })
    .when("/404", { templateUrl: "/views/404.html" })
    .when("/sitemap", { templateUrl: "/views/sitemap.html" })
    .when("/news", { templateUrl: "/views/news.html", controller: "pageNews" })
    .when("/news/:newsId", {
      templateUrl: "/views/news-detail.html",
      controller: "newDetaile",
    })
    .when("/nobel-prizes", {
      templateUrl: "/views/nobel-prizes.html",
      controller: "pageNobelList",
    })
    .when("/nobel-prizes/:bioId", {
      templateUrl: "./views/detail-bio.html",
      controller: "bioDetaile",
    })
    .when("/about-us", {
      templateUrl: "/views/about-us.html",
      controller: "pageAboutUs",
    })
    .when("/contact", {
      templateUrl: "/views/contact.html",
      controller: "pageContact",
    })
    .when("/user", { templateUrl: "/views/user.html", controller: "pageUser" })
    .when("/gallery", {
      templateUrl: "/views/gallery.html",
      controller: "pageGallery",
    })
    .otherwise({ redirectTo: "/404" });
  // $locationProvider.html5Mode(true);
});

app.run(function ($rootScope, $anchorScroll, $location, $interval) {
  $rootScope.scrollTo = function (id) {
    $anchorScroll(id);
  };
  $rootScope.scrollFunction = function () {
    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
    ) {
      document.getElementById("backToTop").style.cssText =
        "display: grid; animation-name: fadeIn";
    } else {
      document.getElementById("backToTop").style.cssText =
        "display: none; animation-name: fadeOut";
    }
  };
  //
  window.onscroll = $rootScope.scrollFunction;
  // Check path = add class
  $rootScope.isActive = function (route) {
    return route === $location.path();
  };
  $rootScope.visitorData =
    JSON.parse(localStorage.getItem("visitorData")) || [];

  // Do action when router change success .
  $rootScope.$on("$routeChangeSuccess", function () {
    // Back To Top when ...
    $rootScope.scrollTo();
    // Visitor count by path
    var item = $rootScope.visitorData.find(function (item) {
      return item.path === $location.path();
    });
    if (item) {
      item.visitor++;
    } else {
      $rootScope.visitorData.push({ path: $location.path(), visitor: 1 });
    }
    localStorage.setItem("visitorData", JSON.stringify($rootScope.visitorData));
    $rootScope.showDataVisitor = $rootScope.visitorData.find(function (item) {
      return item.path === $location.path();
      // return item.path === "/";
    });

    $rootScope.showOffcanvas = false;
  });
  $interval(function () {
    $rootScope.timenow = new Date();
  }, 1000);
  $rootScope.showTime = false;
  $rootScope.showVisitor = false;
});
app.controller("pageHome", function ($scope, $http) {
  $http.get("./data/homepage.json").then(function (resjson) {
    $scope.sliders = resjson.data.sliders;
    $scope.cta = resjson.data.callToAction;
    $scope.topNews = resjson.data.topNews;
    // Optimized use filter
    // $scope.topNews.forEach(function (mysrc) {
    //     if (mysrc.typeMedia == "video") {
    //         mysrc.embedUrl = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + mysrc.scrMedia);
    //     }
    // });
  });
});
app.controller("pageNobelList", function ($scope, $http) {
  $http.get("./data/nobellist.json").then(function (resjson) {
    $scope.nobellist = resjson.data.nobellist;
    // simple pagination page
    $scope.pageSize = 10;
    $scope.totalPages = Math.ceil($scope.nobellist.length / $scope.pageSize);
    $scope.currentPage = 0;
    $scope.setDefaule = function () {
      $scope.selectedCategory = "";
      $scope.selectedYear = "";
    };
    // Random 4 post
    var postRD = [];
    while (postRD.length < 4) {
      let randomNum = Math.floor(Math.random() * $scope.nobellist.length); // generates a random number between 0 and scope.nobellist.length
      if (!postRD.includes(randomNum)) {
        postRD.push(randomNum); // adds the random number to the array
      }
    }
    // console.log(postRD);
    $scope.postRandom = [];
    for (var i = 0; i < postRD.length; i++) {
      $scope.postRandom.push(angular.copy($scope.nobellist[postRD[i]]));
    }
  });
});
app.controller("bioDetaile", function ($scope, $http, $routeParams) {
  $http.get("./data/nobellist.json").then(function (resjson) {
    $scope.detailbio = resjson.data.nobellist;
    var link = $routeParams.bioId;
    $scope.fullinfo = $scope.detailbio.find(function (item) {
      return item.link === link;
    });
    // Optimized
    // $scope.scrollTo = function (id) { $anchorScroll(id); };
    // $rootScope.scrollTo();
  });
});
app.controller("pageNews", function ($scope, $http) {
  $http.get("./data/news.json").then(function (resjson) {
    $scope.news = resjson.data.news;
    $scope.news.forEach(function (news) {
      news.datetime = new Date(news.datetime);
    });
    $scope.pageSize = 10;
    $scope.totalPages = Math.ceil($scope.news.length / $scope.pageSize);
    $scope.currentPage = 0;
  });
});
app.controller("newDetaile", function ($scope, $http, $routeParams) {
  $http.get("./data/news.json").then(function (resjson) {
    $scope.detailnews = resjson.data.news;
    var link = $routeParams.newsId;
    $scope.fullnews = $scope.detailnews.find(function (item) {
      return item.link === link;
    });
    // Optimized
    // $rootScope.scrollTo();
  });
});
// $sce is "Strict Contextual Escaping" /
app.filter("convert", function ($sce) {
  return $sce.trustAsHtml;
});
app.filter("embed", function ($sce) {
  return function (url) {
    return $sce.trustAsResourceUrl(url);
  };
});

// pageAboutUs
app.controller("pageAboutUs", function ($scope, $http) {
  $http.get("./data/aboutus.json").then(function (resjson) {
    $scope.aboutus = resjson.data;
  });
});

// pageGallery
app.controller("pageGallery", function ($scope, $http) {
  $http.get("./data/gallery.json").then(function (resjson) {
    $scope.galleries = resjson.data.gallery;
    // simple pagination page
    $scope.pageSize = 12;
    $scope.totalPages = Math.ceil($scope.galleries.length / $scope.pageSize);
    $scope.currentPage = 0;
    $scope.showModal = function (index) {
      $scope.gallery = [];
      $scope.gallery.push($scope.galleries[$scope.currentPage * 12 + index]);
      console.log($scope.gallery[0]);
      document.getElementById("myModal").style.display = "block";
    };

    // function close modal
    $scope.closeModal = function () {
      document.getElementById("myModal").style.display = "none";
    };
  });
});
