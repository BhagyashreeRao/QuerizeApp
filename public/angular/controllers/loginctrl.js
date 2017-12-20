myApp.controller('loginCtrl',['$http', '$location','$rootScope', '$timeout', 'Auth','AuthToken', '$route','$scope', function($http, $location,$rootScope, $timeout, Auth,AuthToken,$route,$scope) {
 

          var main = this;
          this.loadme=false;
          this.isAdmin=false;
          


        $rootScope.$on('$routeChangeStart',function(){
        if(Auth.isLoggedIn())
        {
        	//console.log("Success:User is logged in.");
        	Auth.getUser().then(function(data){
        		
        		main.username=data.data.username;
                main.email=data.data.email;
                if(data.data.username=='admin' || data.data.username=='ADMIN')
                {
                    main.isAdmin=true;
                    
                }
                main.loadme=true;
        	});
        }
        else{
        	//console.log("failure:User not logged in");
        	main.username='';
        }
        });  

        // Function to submit form and register account
        this.loginUser = function(loginData,valid) {
          
            main.loading = true; // To activate spinning loading icon w/bootstrap
            main.errorMsg = false; // Clear error message each time the user presses submit
            
            // Initiate service to save the user into the dabase            
            Auth.login(main.loginData).then(function(data) {
              
                if (!data.data.error) {
                    main.loading = false; // Once data is retrieved, loading icon should be cleared
                    main.successMsg = data.data.message + '...Redirecting'; // Create Success Message
                    
                    // Redirect to home page after 2000 miliseconds
                    $timeout(function() {

                        $('.modal-backdrop').remove();
                        main.successMsg = false;
                        main.hideModal();
                        $location.path('/user/dashboard');
      
                    }, 2000);
                } else {
                    main.loading = false; // Once data is retrieved, loading icon should be cleared
                    main.errorMsg = data.data.message; // Create an error message
                    main.reset($scope.$$childTail.loginForm,"loginForm");
                }
            });
        };

        this.hideModal = function()
        {
            
            main.reset($scope.$$childTail.loginForm,"loginForm");

        };

         //function to reset the modal form   
        this.reset=function(form,name){
            document.getElementById(name).reset();
            form.$setPristine();
            main.loginData={};
            form.$setUntouched();
            form.$submitted = false;
        };
       

        this.logout=function()
        {	
        	Auth.logout();
        	$location.path('/logout');
        	$timeout(function(){
        		$location.path('/');
                $route.reload();
        	},2000);
        };
}]);