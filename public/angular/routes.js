myApp.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/',{
            // location of the template
        	templateUrl		: 'angular/views/index-view.html',
        	// Which controller it should use 
            controller 		: 'mainCtrl',
            // what is the alias of that controller.
        	controllerAs 	: 'main',

            authenticated   :  false
        })

        .when('/user/dashboard',{
            templateUrl     : 'angular/views/dashboard-view.html',

            controller      :  'dashboardCtrl',

            controllerAs    :  'dashboard',

            authenticated   :   true

        })
        .when('/logout',{
            templateUrl     : 'angular/views/logout-view.html',

            authenticated   :   false

        })
        .when('/query/post/:currentuser',{
            templateUrl     : 'angular/views/post-view.html',

            controller      : 'postCtrl',

            controllerAs    : 'post',

            authenticated   :   true 
        })

        .when('/query/get/:queryId',{
            templateUrl     : 'angular/views/query-view.html',

            controller      : 'queryCtrl',

            controllerAs    : 'query',

            authenticated   :   true 
        })

        .otherwise({
            //redirectTo:'/'
            template   : '<h2>404 page not found</h2>'

        });

}]);


//Avoid unauthorized access to routes
myApp.run(['$rootScope','Auth','$location',function($rootScope,Auth,$location){
    $rootScope.$on('$routeChangeStart',function(event,next,current){

        if(next.hasOwnProperty('$$route')){
            //If logged In
            if(next.$$route.authenticated==true){

                if(Auth.isLoggedIn()){
                    //Call authService to get User
                    Auth.getUser().then(function(data){
                        //If error
                        if(data.data.error){
                            event.preventDefault();
                            $location.path('/');
                        }          
                    });
                }
                else
                {
                    event.preventDefault();
                    $location.path('/');
                }
                
            }
            //If not logged in
            if(next.$$route.authenticated==false){

                if(Auth.isLoggedIn()){
                    //Call authService to get User
                    Auth.getUser().then(function(data){

                        //If error
                        if(!data.data.error){
                            event.preventDefault();
                            $location.path('/user/dashboard');
                        }          
                    });
                }
                
            }
        }

    });
}]);
