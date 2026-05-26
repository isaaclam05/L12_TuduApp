const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

// =====================
// ARRAY DATABASE
// =====================

let taskList = [];

// =====================
// ROUTES
// =====================

// HOME
app.get('/', (req, res) => {

    res.render('index');

});

// ADD TASK PAGE
app.get('/add-task', (req, res) => {

    res.render('addtask');

});

// SAVE TASK
app.post('/add-task', (req, res) => {

    const {
        title,
        description,
        dueDate,
        priority
    } = req.body;

    const newTask = {

        id: Date.now(),

        title,

        description,

        dueDate,

        priority,

        completed: false
    };

    taskList.push(newTask);

    console.log(taskList);

    res.redirect('/tasks');

});

// TASK LIST
app.get('/tasks', (req, res) => {

    res.render('tasklist', {
        taskList
    });

});

// TASK DETAILS
app.get('/task/:id', (req, res) => {

    const taskId =
        Number(req.params.id);

    const task =
        taskList.find(
            task =>
                task.id === taskId
        );

    res.render(
        'taskdetails',
        { task }
    );

});

// START SERVER
app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});