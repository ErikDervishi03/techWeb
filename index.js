const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const _ = require("lodash");
const cors = require('cors');

mongoose.set('strictQuery', false);
app.use(cors());
// Set the view engine to EJS
app.set("view engine", "ejs");
// Middleware for parsing application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files directory
app.use(express.static(path.join(__dirname, "public")));

// Database connection
const mongoDBUri = "mongodb+srv://erikdervishiedu:EyMLHSL3F4cYpVsX@eriksclaster.joktuoe.mongodb.net/?retryWrites=true&w=majority&appName=eriksClaster";
mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true });

// Mongoose schema for Todos
const todoSchema = new mongoose.Schema({
    obj: String,
    startingDate: {type: Date}, 
    endingDate: {type: Date},
    priority: String,
    category: String
});


const Todo = mongoose.model("TODO", todoSchema);

app.get("/", async (req, res) => {
    try {
        let categories = await Todo.distinct('category');
        
        // Fetch all todos and sort by priority
        let allTodos = await Todo.find().sort({ priority: 1 });

        // Group todos by category
        const todosByCategory = {};
        allTodos.forEach(todo => {
            if (!todosByCategory[todo.category]) {
                todosByCategory[todo.category] = [];
            }
            todosByCategory[todo.category].push(todo);
        });

        // Filtering todos based on search query
        const searchQuery = req.query.search;
        if (searchQuery) {
            if(categories.includes(searchQuery)){
                categories = [searchQuery];
            }else{
                
                return res.status(404).send(`The category '${searchQuery}' doesn't exist.`);
            }
                
        }

        res.render("home", { todosByCategory, categories });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching todos');
    }
});

app.get("/compose", (req, res) => {
    const today = new Date().toISOString().split('T')[0]; 
    res.render("compose", { today }); 
});

app.post("/compose", async (req, res) => {
    const newTodo = new Todo({
        obj: req.body.obj,
        startingDate: req.body.startingDate,
        endingDate: req.body.endingDate,
        priority: req.body.priority,
        category: req.body.category
    });

    try {
        await newTodo.save();
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving todo');
    }
});

// Update any redirect or link that refers to this route
// For example, in your views or redirection after creating a post

app.post("/delete-todo", async (req, res) => {
    const todoId = req.body.todoId;
    try {
        await Todo.findByIdAndDelete(todoId);
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting todo');
    }
});


// Listen on default port 3000
app.listen(4000);
