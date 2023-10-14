//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import ejs from "ejs";

const app = express();
const port = process.env.PORT || 3030;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://bpetznick:November211989@cluster0.nd9zxri.mongodb.net/blogDB");

const postSchema = mongoose.Schema ({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {

  async function myPosts() {
    try {
        const posts= await Post.find({});
        res.render("home.ejs", {posts:posts});
    }  catch (err) {
        console.log(err);
    }
}
myPosts();
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/", (req, res) => {
  const postTitle = req.body.title;
  const postContent = req.body.content;

const post = new Post ({
    title: postTitle,
    content: postContent
});
async function savePost() {
  await post.save();
  res.redirect("/");
}
savePost();

});

app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;
  console.log(requestedPostId);
  async function getPost() {
    try {
  const post = await Post.findOne({_id: requestedPostId}).exec();
  res.render("post", {
    title: post.title,
    content: post.content,
    id: requestedPostId
  });
} catch (err) {
  console.log(err);
}
};
 getPost(); 
  });

  app.post("/delete/:postId", function(req, res){

    const requestedPostId = req.params.postId;
    console.log(requestedPostId);
    async function deleteItems() {
      try {
        const deletePost = await Post.findOneAndDelete({ _id: requestedPostId }).exec();
        console.log("Removed successfully!");
        res.redirect("/");
      } catch (err) {
        console.log(err);
      }
    };
    deleteItems();
    });

    app.get("/about", function(req, res){
      res.render("about");
    });

    app.get("/contact", function(req, res){
      res.render("contact");
    });

app.listen(port, function() {
  console.log("Server started on port " + port);
});
