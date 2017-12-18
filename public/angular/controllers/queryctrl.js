myApp.controller('queryCtrl',['$http', '$location', '$timeout','Query','$route','$routeParams','$scope','$window', function($http, $location, $timeout, Query, $route,$routeParams,$scope,$window) {
 
          var main = this;
          this.queryDetails={};
          this.qId=$routeParams.queryId;
          this.commentData={};
    

       
            main.loading = true; 
            main.errorMsg = false; 

            // Initiate service to get query details            
            Query.getQueryDetails(main.qId).then(function(data) {
              
                if (!data.data.error) {
                    main.loading = false; // Once data is retrieved, loading icon should be cleared
                    main.successMsg = data.data.message + '...Redirecting'; // Create Success Message



                    main.queryDetails=data.data.data[0];
                    
                } 
                  else {
                    main.loading = false; // Once data is retrieved, loading icon should be cleared
                    main.errorMsg = data.data.message; // Create an error message
                }
            });

            this.postAnswer=function(currentUser,comment){

              main.commentData.postedBy=currentUser;
              main.commentData.posted_on=Date.now();
              main.commentData.comment=comment;
              

              Query.postComment(main.qId,main.commentData).then(function(data){
                
                $route.reload();
              });


            };

            this.changeQueryStatus=function(){
              Query.changeStatus(main.qId).then(function(data){
                
                $route.reload();
              });
            };
}]);













