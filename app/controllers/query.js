var mongoose = require( 'mongoose' );
var express= require('express');

var queryModel = mongoose.model('Query');
var userModel = mongoose.model('User');

var queryRouter  = express.Router();
var responseGenerator = require('./../../libs/responseGenerator');
var sendMail = require('./../../libs/sendMail'); 


module.exports.controllerFunction = function(app) {

    //get all queries
    queryRouter.get('/all',function(req,res){
        queryModel.find({},function(err,allQueries){
            if(err){                
                //res.send(err);
                var myResponse = responseGenerator.generate(true,"Can't fetch queries due to some error",400,null);
                    //res.json({ success: false, message: 'Username or Email already exists!' }); // Cannot save if username or email exist in the database
                res.json(myResponse);
            }
            else{

                var myResponse = responseGenerator.generate(false,"Queries fetched ",201,allQueries);
                    //res.json({ success: false, message: 'Username or Email already exists!' }); // Cannot save if username or email exist in the database
                res.json(myResponse);

            }

        });//end user model find 

    });//end get all users
    
    //get queries of cuurrentuser
    queryRouter.get('/all/:currentuser',function(req,res){
        queryModel.find({'creator':req.params.currentuser},function(err,allQueries){
            if(err){                
                var myResponse = responseGenerator.generate(true,"Can't fetch queries due to some error",400,null);
                   
                res.json(myResponse);
            }
            else{

                var myResponse = responseGenerator.generate(false,"Queries fetched ",201,allQueries);
                   
                res.json(myResponse);

            }

        });//end user model find 

    });//end get all users

    //get details of a query
    queryRouter.get('/get/:queryId',function(req,res){
        queryModel.find({'_id':req.params.queryId},function(err,query){
            if(err){
                var myResponse = responseGenerator.generate(true,"no query with this id",400,null);
                res.json(myResponse);
            }
            else{
                var myResponse = responseGenerator.generate(false,"query found",201,query);
                res.json(myResponse);
            }
        });
    });

    //post a query
    queryRouter.post('/post/:currentuser',function(req,res){


        if(req.body.title!=undefined && req.body.title!='' && req.body.description!=undefined && req.body.description!= '' ){

                var query = new queryModel({
                
                title               : req.body.title,
                description          : req.body.description,
                creator             : req.params.currentuser


            });// end new user 

            

            query.save(function(err){
                if(err){

                    var myResponse = responseGenerator.generate(true,"Some error occured "+err,400,null);
                    //res.json({ success: false, message: 'Username or Email already exists!' }); // Cannot save if username or email exist in the database
                    res.json(myResponse);
              }
              else{
                   
                var myResponse = responseGenerator.generate(false,"Query posted successfully ! ",201,null);
                res.json(myResponse);
                }
            });//end new user save
       }
        else{
          
           var myResponse = responseGenerator.generate(true,"Ensure query description and title were provided!",400,null);
              res.json(myResponse);
        }


       
    });//end post query

    //post a comment on a query
    queryRouter.post('/comment/:queryId',function(req,res)

        {   
            queryModel.findOneAndUpdate({'_id':req.params.queryId},{$push: { "comments": req.body } },function(err,query){
            if(err){
                var myResponse = responseGenerator.generate(true,"no query with this id",400,null);
                res.json(myResponse);
            }
            else{
                

                if(req.body.comment==undefined || req.body.comment=='')
                {
                    var myResponse = responseGenerator.generate(true,"Please write an answer",400,null);
                    res.json(myResponse);                    
                }
                else
                {    
                    userModel.findOne({'username':query.creator},function(err,user){
                        
                    if(user){
                        
                        sendMail.sendMail('admin@querize',user.email,'comment notification',req.body.postedBy+' commented on your query.Please login to querize to view the comment',req.body.postedBy+' commented on your query.Please login to querize to view the comment');
                    }
                    });
                    var myResponse = responseGenerator.generate(false,"comment posted !",201,query);
                    
                    res.json(myResponse);

                }
            }
        });

        });

    //change status of query
    queryRouter.post('/change_status/:queryId',function(req,res)

        {    
            queryModel.findOne({'_id':req.params.queryId},function(err,query){
            if(err){
                var myResponse = responseGenerator.generate(true,"no query with this id",400,null);
                res.json(myResponse);
            }
            else{
                if(query.open==true)
                {
                    queryModel.updateOne({'_id':req.params.queryId},{$set: {open: false} },function(err,newQuery){
                        if(err){
                            var myResponse = responseGenerator.generate(true,"Cannot update status",400,null);
                            res.json(myResponse);
                        }
                        else{
                            
                            userModel.findOne({'username':query.creator},function(err,user){
                        
                                if(user){
                                
                                sendMail.sendMail('admin@querize',user.email,'status notification','The status of your query titled '+query.title+' has been changed to closed. ','The status of your query titled '+query.title+' has been changed to closed. ');
                                }
                            }); 

                            var myResponse = responseGenerator.generate(false,"Status changed !",201,newQuery);
                            res.json(myResponse);
                        }
                    });
                }
                else
                {
                    queryModel.updateOne({'_id':req.params.queryId},{$set: {open: true} },function(err,newQuery){
                        if(err){
                            var myResponse = responseGenerator.generate(true,"Cannot update status",400,null);
                            res.json(myResponse);
                        }
                        else{
                             userModel.findOne({'username':query.creator},function(err,user){
                        
                            if(user){
                        
                                sendMail.sendMail('admin@querize',user.email,'status notification','The status of your query titled '+query.title+' has been changed to open. ','The status of your query titled '+query.title+' has been changed to open. ');
                            }
                    });                            
                            var myResponse = responseGenerator.generate(false,"Status change !",201,newQuery);
                            res.json(myResponse);
                        }
                    });
                }
            }
        });

        });

 
    app.use('/query', queryRouter);
}; //end contoller code


