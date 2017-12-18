myApp.controller('dashboardCtrl',['$http', '$location', '$timeout', 'Query', '$route','$scope', function($http, $location, $timeout, Query, $route,$scope) {
 
          var main = this;
          this.allQueries=[];
          this.userQueries=[];
          this.filter=false;
          this.showAll=true;

        

        // Function to submit form and register account
          
            main.loading = true; 
            main.errorMsg = false; 

            // Initiate service to save the user into the dabase

            Query.getAllQueries().then(function(data) {
              
                if (!data.data.error) {
                    main.loading = false; // Once data is retrieved, loading icon should be cleared

                    main.allQueries=data.data.data;
                } 
                else {
                    main.loading = false; // Once data is retrieved, loading icon should be cleared
                    main.errorMsg = data.data.message; // Create an error message
                }
            });


}]);