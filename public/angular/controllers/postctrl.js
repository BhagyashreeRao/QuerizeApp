myApp.controller('postCtrl',['$http', '$location', '$timeout', 'Query', '$route','$scope', function($http, $location, $timeout, Query, $route,$scope) {
 
          var main = this;
        

        // Function to submit form and register account
        this.postQuery = function(currentuser,queryData) {
          
            main.loading = true; // To activate spinning loading icon w/bootstrap
            main.errorMsg = false; // Clear error message each time the user presses submit

            // Initiate service to save the user into the dabase            
            Query.post(currentuser,main.queryData).then(function(data) {

                if (!data.data.error) {
                    main.loading = false; // Once data is retrieved, loading icon should be cleared
                    main.successMsg = data.data.message + '...Redirecting'; // Create Success Message
                    // Redirect to home page after 2000 miliseconds
                    $timeout(function() {
                       // $('.modal-backdrop').remove();
                        $location.path('/user/dashboard');
                        //$route.reload();
                    }, 2000);
                } else {
                    main.loading = false; // Once data is retrieved, loading icon should be cleared
                    main.errorMsg = data.data.message; // Create an error message
                }
            });
        };
}]);