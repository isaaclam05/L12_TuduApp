const express = require("express");

const app = express();

const PORT = 3000;

app.set(
    "view engine",
    "ejs"
);

app.use(
    express.static("public")
);

app.use(
    express.urlencoded({
        extended: true
    })
);

const tasks = [
    {
        id: 1,
        title: "Finish Assignment",
        category: "School",
        priority: "High",
        description:
            "Complete software development assignment."
    },

    {
        id: 2,
        title: "Gym Session",
        category: "Personal",
        priority: "Medium",
        description:
            "Workout for 1 hour."
    },

    {
        id: 3,
        title: "Meeting",
        category: "Work",
        priority: "Low",
        description:
            "Attend weekly project meeting."
    }
];

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/tasks", (req, res) => {
    res.render(
        "tasklist",
        {
            tasks
        }
    );
});

app.get("/add-task", (req, res) => {
    res.render("addtask");
});

app.get("/task/:id", (req, res) => {

    const task =
        tasks.find(
            t =>
                t.id ==
                req.params.id
        );

    res.render(
        "taskdetails",
        {
            task
        }
    );
});

app.get("/profile", (req, res) => {
    res.render("profile");
});

app.listen(PORT, () => {
    console.log(
        `Server running at http://localhost:${PORT}`
    );
});