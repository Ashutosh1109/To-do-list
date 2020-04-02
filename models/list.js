const mongoose=require('mongoose');
const obj=require('./item')
var itemSchema=obj.itemSchema;
const listSchema= new mongoose.Schema({
name:{
  type:String,
  required:true
},
item:[itemSchema]
});
List=mongoose.model('list',listSchema);
module.exports=Object.freeze({
itemSchema:listSchema,
List:List

});
