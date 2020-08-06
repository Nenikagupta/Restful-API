const express=require('express');
const bodyparser=require('body-parser');
const mongoose=require('mongoose');
const ejs=require('ejs');

const app=express();

app.set('view engine', 'ejs');  //using express to use ejs as a view engine

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true,useUnifiedTopology: true});

const wikiSchema=new mongoose.Schema({
  title:"String",
  content:"String"
});

const Article=mongoose.model("Article",wikiSchema);


/////////////////////////////////////route for all articles ///////////////////////////////////////////////////////////////////////////////////
app.route("/articles")

.get(function(req,res){

  Article.find(function(err,foundArticles){
    if(err){
      res.send(err);
    }else{
      res.send(foundArticles);
    }
  });
})

.post(function(req,res){

  const newArticle=new Article({
    title:req.body.title,
    content:req.body.content
  });

  newArticle.save(function(err){
    if(err){
      res.send(err);
    }else{
      res.send("Successfuly inserted in database");
    }
  });
})

.delete(function(req,res){

  Article.deleteMany(function(err){
    if(err){
      res.send(err);
    }else{
      res.send("Successfuly Deleted from database");
    }
  });
});


/////////////////////////////////////route for specific articles ///////////////////////////////////////////////////////////////////////////////////

app.route("/articles/:Articletitle")

.get(function(req,res){

  Article.findOne({title:req.params.Articletitle},function(err,foundArticle){
    if(err){
      res.send(err);
    }else{
      res.send(foundArticle);
    }
  });
})

.put(function(req,res){

    Article.update(
      {title:req.params.Articletitle},
      { title:req.body.title,content:req.body.content},
      {overwrite:true},
      function(err){
        if(err){
          res.send(err);
        }else{
          res.send("Updated Successfuly");
        }
      });
})

.patch(function(req,res){
  Article.update(
    {title:req.params.Articletitle},
    { $set: req.body},
    function(err){
      if(err){
        res.send(err);
      }else{
        res.send("Updated Successfuly");
      }
    });
})

.delete(function(req,res){

  Article.deleteOne({title:req.params.Articletitle},function(err){
    if(err){
      res.send(err);
    }else{
      res.send("Deleted Successfuly Article having title "+req.params.Articletitle);
    }
  });
});

app.listen(3000,function(){
  console.log("Server has started at host 3000");
});
