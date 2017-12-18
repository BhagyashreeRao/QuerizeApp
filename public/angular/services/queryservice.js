myApp.factory('Query', function($http) {
		var queryFactory = {}; // Create the Query object

		// User.create(userData)
		queryFactory.post = function(currentuser,queryData) {
			return $http.post('/query/post/'+currentuser, queryData); // Return data from end point to controller

		};

		queryFactory.getAllQueries = function(){
			return $http.get('/query/all');
		};

/*		queryFactory.getQueriesOfCurrentUser = function(currentUser){
			return $http.get('/query/all/'+ currentUser);
		};*/

		queryFactory.getQueryDetails = function(queryId){
			return $http.get('/query/get/'+queryId);
		};

		queryFactory.postComment = function(queryId,commentData){
			return $http.post('/query/comment/'+queryId,commentData);
		};
		
		queryFactory.changeStatus = function(queryId){
			return $http.post('/query/change_status/'+queryId);
		};

		return queryFactory;
	});

