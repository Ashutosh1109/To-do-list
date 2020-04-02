const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/itemDB',{ useNewUrlParser: true });
var obj_item=require('./models/item');
var item=obj_item.Item;

var obj_list=require('./models/list');
var list=obj_list.List;

var _=require('lodash');
var item1=new item({
  name:'press add to insert'
});
var item2=new item({
  name:'click check to delete'
});
var default_items=[item1,item2];

var today=new Date();
var options={
  weekday: 'long',
   year: 'numeric',
    month: 'long',
    day: 'numeric'
}
var day=  today.toLocaleDateString('hi-IN',options);

app.get('/',function(req,res){
// to find todays date


item.find(function(error,items){
  if(error)
  {console.log(error);}
  else {

if(items.length===0)
{
  item.insertMany([{
    name:'buy food'
  },
  {
  name:'cook food'
  },
  {
    name:'eat food'
  }],function(error,obj){
    if(error)
    {console.log(error);}
    else {
      console.log(obj)
    }
  });
res.redirect('/');
}
  else {
    res.render('list',{listTitle:'today',
                        newitems:items});
  }

  }
});

});

app.post('/',function(req,res){
var item_name=req.body.fname;
var list_name=req.body.list;
console.log(list_name);
var new_item= new item({
  name:item_name
});
if(list_name=== 'today')
{
  new_item.save(function(error,new_item){
  if(error)
  {
res.json(error.message);
  }

  else {
    console.log(new_item);
    res.redirect('/');
  }
});
}
else {
  list.findOne({name:list_name},function(error,found_list){
    if(error)
    {res.json(error.message);}
    else  {
      found_list.item.push(new_item);
      found_list.save(function(error,list){
        if(error)
        {res.json(error.message);}
        else {
          res.redirect('/'+list.name);
        }
      });
    }
  });
}

});

app.post('/delete',function(req,res){
  var item_id=req.body.checkbox ;
  //check for list from which item is deleted
var list_=req.body.list_name;
if(list_==='today')
{
  item.deleteOne({_id :item_id},function(error,deleted_item){
    if(error)
    {res.json(error.message);}
    else {
      console.log(deleted_item)
      res.redirect('/');
    }
  });
}
else {
  list.findOneAndUpdate({name:list_},{$pull:{item:{_id:item_id}}},function(error,list_re){
    if(error)
    {res.json(error.message);}
    else {
      res.redirect('/'+list_);
    }
  });
}

});

app.get('/:variable',function(req,res){
  var custom_listname=_.capitalize(req.params.variable);
list.findOne({name:custom_listname},function(error,obj){
  if(error)
  {
  res.json(error.message);
}
  else {
    if(!obj)
    { console.log(obj)
      var new_list= new list({
        name:custom_listname,
        item:default_items
      });
      new_list.save(function(error,saved_list){
        if(error)
        {res.json(error.message);}
        else {
          res.redirect('/'+custom_listname);
        }
      });
    }
    else {
      res.render('list',{listTitle:obj.name,
                          newitems:obj.item});
    }

  }
});


});

app.get('/about',function(req,res){
  res.render('about');
})


app.listen(3000,function(){
  console.log('server started on port 3000');
})
