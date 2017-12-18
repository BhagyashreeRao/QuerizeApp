var mongoose = require('mongoose');
// declare schema object.
var Schema = mongoose.Schema;

var querySchema = new Schema({
  title          : 	{type: String},
  description    : 	{type: String},
  comments       :  [],
  creator        :  {type: String},
  open           :  {type: Boolean, default:true},  
  created_on     :  {type:Date,default:Date.now}
});

mongoose.model('Query',querySchema);

