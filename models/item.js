const mongoose=require('mongoose');

const itemSchema= new mongoose.Schema({
name:{
  type:String,
  required:true
}
});
Item=mongoose.model('item',itemSchema);
module.exports=Object.freeze({
itemSchema:itemSchema,
Item:Item

});
