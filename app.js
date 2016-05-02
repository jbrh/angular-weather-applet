//MODULE
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);//include array of dependencies


//ROUTES -- set up routing for single page application
weatherApp.config(function ($routeProvider) {
    
    $routeProvider
    
    .when('/', {
        templateUrl: 'pages/home.htm',
        controller: 'homeController'
    })
    
    .when('/forecast', {
        templateUrl: 'pages/forecast.htm',
        controller: 'forecastController'
    })
    
    .when('/forecast/:days', {
        templateUrl: 'pages/forecast.htm',
        controller: 'forecastController'
    })
    
    
});

//CUSTOM SERVICES
weatherApp.service('cityService', function() {
    
    this.city = "New York, NY";// this object has city property because it is inside the function
    
});


//CONTROLLERS using array format to facilitate minimization
//controller for home page
weatherApp.controller('homeController', ['$scope', 'cityService', function($scope, cityService) {
    
    $scope.city = cityService.city;//scope value that is gotten from current value in custom service
    
    $scope.$watch('city', function() {
        cityService.city = $scope.city;
    });// watch this value cause it will change as it is bound to a text box and when it changes update cityService to the current value of scope
    
    
}]);

//controller for forecast page
weatherApp.controller('forecastController', ['$scope', '$resource', 'cityService', '$routeParams', function($scope, $resource, cityService, $routeParams) {
    
    $scope.city = cityService.city;
    
    $scope.days = $routeParams.days || '2';//number of days for forecast needs to be string default is 2 days
    //.days -- class set in ng-class in forecast.html
    
    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily?APPID=97fdbcc4c41b4d904ac584138fc2097e", { callback: "JSON_CALLBACK" }, { get: { method: "JSONP"}}); // need the callback for security issues -- the JSONP says it is OK, not a hack attempt.  Resource now available in scope.
    
    $scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, cnt: $scope.days });
    //pass to weatherAPI an object that contains the parameters q and cnt, which is what was used by openweathermap to identify city name (q) and days of forecast (cnt).
    
    $scope.convertToFahrenheit = function(degK) {
        
        return Math.round((1.8 * (degK - 273)) + 32);
        
    }//converts Kelvin to Fahrenheit
    
    $scope.convertToDate = function(dt) { 
      
        return new Date(dt * 1000);//needed to multiply by 1,000 to convert from date based on milliseconds
        
    }//converts value on openweathermap to readable date
    
    $scope.convertHpaToInhg = function(hpa) {
        
         var pressure = (0.295300 * ((hpa / 10.0)*100)/100);
        return pressure.toFixed(2);
    };//convert hpa to inHg
    
       
}]);

