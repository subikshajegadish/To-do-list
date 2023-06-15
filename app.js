//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://subikshajegadish:test123@cluster0.elepum2.mongodb.net/todolistDB');
const itemsSchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todoList"
})
const item2 = new Item({
  name: "Hit the + button to add a new item"
})
const item3 = new Item({
  name: "<--Hit this to delete this item"
})

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

// Item.insertMany(defaultItems).then(function(){
//     console.log("Data inserted")
// }).catch(function(error){
//     console.log(error)
// });


app.get("/", function(req, res) {


  Item.find().then(function(foundItems){
    if(foundItems.length === 0){
      Item.insertMany(defaultItems).then(function(){
          console.log("Data inserted")
      }).catch(function(error){
          console.log(error)
      });
      res.redirect("/");
    }else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  })


});

app.get("/:customListName", function(req, res){
  customListName = req.params.customListName;
  const list = new List({
    name: customListName,
    items: defaultItems
  });
  list.save();
})

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");

});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId).then(function(){
      console.log("Data Removed")
  }).catch(function(error){
      console.log(error)
  });
  res.redirect("/");

});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
