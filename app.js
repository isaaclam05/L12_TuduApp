const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

/* ==========================
CONFIG
========================== */

app.set("view engine", "ejs");

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(
    path.join(__dirname, "public")
));

/* ==========================
DATA
========================== */

let taskList = [];
let currentId = 1;

/* ==========================
HELPERS
========================== */

function getTodayDate() {

    const today = new Date();

    return today
        .toISOString()
        .split("T")[0];
}

/* AUTO STATUS */

function updateTaskStatus() {

    const today = getTodayDate();

    taskList.forEach(task => {

        if (
            task.status ===
            "Completed"
        ) {
            return;
        }

        if (
            task.dueDate &&
            task.dueDate < today
        ) {

            task.status =
            "Overdue";
        }

        else {

            task.status =
            "Pending";
        }
    });
}

/* SORT TASKS */

function sortTasks() {

    taskList.sort((a, b) => {

        /* newest first */

        if (b.id !== a.id) {
            return b.id - a.id;
        }

        /* due date */

        if (
            a.dueDate &&
            b.dueDate
        ) {

            return new Date(a.dueDate)
            - new Date(b.dueDate);
        }

        return 0;
    });
}

/* DASHBOARD STATS */

function getDashboardStats() {

    return {

        totalTasks:
        taskList.length,

        completedTasks:
        taskList.filter(
            task =>
            task.status ===
            "Completed"
        ).length,

        pendingTasks:
        taskList.filter(
            task =>
            task.status ===
            "Pending"
        ).length,

        overdueTasks:
        taskList.filter(
            task =>
            task.status ===
            "Overdue"
        ).length
    };
}

/* ==========================
HOME
========================== */

app.get("/", (

    req,
    res

) => {

    updateTaskStatus();
    sortTasks();

    const stats =
    getDashboardStats();

    res.render(
        "index",
        {

            taskList,

            ...stats
        }
    );
});

/* ==========================
TASK LIST
========================== */

app.get("/tasks", (

    req,
    res

) => {

    updateTaskStatus();
    sortTasks();

    const search =
    req.query.search || "";

    const filter =
    req.query.filter || "All";

    let filteredTasks =
    [...taskList];

    /* SEARCH */

    if (search.trim()) {

        const keyword =
        search.toLowerCase();

        filteredTasks =
        filteredTasks.filter(task =>

            task.title
            .toLowerCase()
            .includes(keyword)

            ||

            (task.description || "")
            .toLowerCase()
            .includes(keyword)

            ||

            (task.category || "")
            .toLowerCase()
            .includes(keyword)
        );
    }

    /* FILTER */

    if (
        filter !== "All"
    ) {

        filteredTasks =
        filteredTasks.filter(
            task =>
            task.status ===
            filter
        );
    }

    res.render(
        "tasklist",
        {

            taskList:
            filteredTasks,

            search,

            filter
        }
    );
});

/* ==========================
ADD TASK PAGE
========================== */

app.get(
    "/add-task",

    (req, res) => {

    res.render(
        "addtask",
        {
            task: null
        }
    );
});

/* ==========================
ADD TASK
========================== */

app.post(
"/add-task",

(req, res) => {

    const {

        title,
        description,
        dueDate,
        priority,
        category

    } = req.body;

    taskList.push({

        id:
        currentId++,

        title:
        title.trim(),

        description:
        description.trim(),

        dueDate,

        priority:
        priority ||
        "Medium",

        category:
        category?.trim()
        || "General",

        status:
        "Pending",

        createdAt:
        new Date()
    });

    res.redirect(
        "/tasks"
    );
});

/* ==========================
TASK DETAILS
========================== */

app.get(
"/task/:id",

(req, res) => {

    updateTaskStatus();

    const task =
    taskList.find(

        task =>
        task.id ===
        parseInt(
            req.params.id
        )
    );

    if (!task) {

        return res
        .status(404)
        .send(
            "Task not found"
        );
    }

    res.render(
        "taskdetails",
        { task }
    );
});

/* ==========================
EDIT PAGE
========================== */

app.get(
"/task/edit/:id",

(req, res) => {

    const task =
    taskList.find(

        task =>
        task.id ===
        parseInt(
            req.params.id
        )
    );

    if (!task) {

        return res
        .status(404)
        .send(
            "Task not found"
        );
    }

    res.render(
        "addtask",
        { task }
    );
});

/* ==========================
UPDATE TASK
========================== */

app.post(
"/task/edit/:id",

(req, res) => {

    const task =
    taskList.find(

        task =>
        task.id ===
        parseInt(
            req.params.id
        )
    );

    if (task) {

        task.title =
        req.body.title.trim();

        task.description =
        req.body.description.trim();

        task.dueDate =
        req.body.dueDate;

        task.priority =
        req.body.priority;

        task.category =
        req.body.category.trim()
        || "General";
    }

    res.redirect(
        `/task/${req.params.id}`
    );
});

/* ==========================
COMPLETE TASK
========================== */

app.post(
"/task/complete/:id",

(req, res) => {

    const task =
    taskList.find(

        task =>
        task.id ===
        parseInt(
            req.params.id
        )
    );

    if (task) {

        task.status =
        "Completed";
    }

    res.redirect(
        "/tasks"
    );
});

/* ==========================
DELETE TASK
========================== */

app.post(
"/task/delete/:id",

(req, res) => {

    taskList =
    taskList.filter(

        task =>
        task.id !==
        parseInt(
            req.params.id
        )
    );

    res.redirect(
        "/tasks"
    );
});

/* ==========================
404 PAGE
========================== */

app.use((req, res) => {

    res.status(404).send(`
        <div style="
        font-family:Inter;
        display:flex;
        justify-content:center;
        align-items:center;
        height:100vh;
        background:#F5F7FB;
        ">
            <div style="
            background:white;
            padding:50px;
            border-radius:30px;
            text-align:center;
            box-shadow:0 10px 30px rgba(0,0,0,.08)
            ">
                <h1>404</h1>
                <p>Page not found</p>
                <a href="/">Go Home</a>
            </div>
        </div>
    `);
});

/* ==========================
SERVER
========================== */

app.listen(PORT, () => {

    console.log(`Server running: http://localhost:${PORT}`);
});